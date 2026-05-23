import mongoose from "mongoose";
import { ReferralModel } from "../Referral/referral.model";
import { ReferralRewardModel } from "../ReferralRewardTracker/referralReward.model";

/**
 * Record a referral pair at sign-up.
 * - Idempotent: won’t create duplicates.
 * - Ensures a reward summary doc for the referrer.
 * - Increments totalReferred **only** on first insert.
 * - No bonus credit here; payout happens in releaseReferralBonuses on first deposit.
 */
export const trackReferral = async (
  referredUserId: string,
  referrerId: string,
  externalSession?: mongoose.ClientSession
) => {
  const session = externalSession || await mongoose.startSession();
  let ownSession = false;
  if (!externalSession) {
    session.startTransaction();
    ownSession = true;
  }

  try {
    // 1) Insert the pair once (idempotent)
    const upsertRes = await ReferralModel.updateOne(
      { referredUser: referredUserId },
      { $setOnInsert: { referredUser: referredUserId, referrer: referrerId } },
      { upsert: true, session }
    );

    // was this the first time we inserted this pair?
    const firstInsert = (upsertRes as any).upsertedCount === 1 || (upsertRes as any).upsertedId;

    // 2) Ensure summary exists
    await ReferralRewardModel.updateOne(
      { referrer: referrerId },
      {
        $setOnInsert: {
          referrer: referrerId,
          totalReferred: 0,
          totalPendingTK: 0,
          totalPendingCoin: 0,
          totalReleasedTK: 0,
          totalReleasedCoin: 0,
        },
      },
      { upsert: true, session }
    );

    // 3) Only bump totalReferred on first insert of the pair
    if (firstInsert) {
      await ReferralRewardModel.updateOne(
        { referrer: referrerId },
        { $inc: { totalReferred: 1 } },
        { session }
      );
    }

    if (ownSession) await session.commitTransaction();
  } catch (err) {
    if (ownSession) await session.abortTransaction();
    throw err;
  } finally {
    if (ownSession) session.endSession();
  }
};
