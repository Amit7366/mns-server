import mongoose from "mongoose";
import { ReferralModel } from "../Referral/referral.model";
import { UserBalance } from "../Transaction/userBalance.model";
import { ReferralBonusTracking } from "./referralBonusTracking.model";
import { ReferralRewardModel } from "./referralReward.model";

export const releaseReferralBonuses = async (referrerId: string) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const reward = await ReferralRewardModel.findOne({ referrer: referrerId }).session(session);
    const pendingTK = Number(reward?.totalPendingTK || 0);

    if (!reward || pendingTK <= 0) {
      await session.commitTransaction();
      await session.endSession();
      return;
    }

    const unitSize = 500;
    let unitsToRelease = Math.floor(pendingTK / unitSize);
    if (unitsToRelease <= 0) {
      await session.commitTransaction();
      await session.endSession();
      return;
    }

    // Get user balance
    const ub = await UserBalance.findOne(
      { userId: referrerId },
      { id: 1, _id: 0 }
    )
      .session(session)
      .lean();

    if (!ub?.id) throw new Error("Cannot release referral bonuses: UserBalance.id missing.");
    const memberId = ub.id;

    // All referrals for this referrer
    const referrals = await ReferralModel.find(
      { referrer: referrerId },
      { referredUser: 1 }
    )
      .sort({ _id: 1 })
      .session(session)
      .lean();

    let createdCount = 0;
    for (const r of referrals) {
      if (createdCount >= unitsToRelease) break;

      // Create tracking entry if missing
      const res = await ReferralBonusTracking.updateOne(
        { userId: referrerId, referredUserId: r.referredUser },
        {
          $setOnInsert: {
            userId: referrerId,
            referredUserId: r.referredUser,
            bonusAmount: unitSize, // 500
            turnoverRequired: unitSize * 8, // 4000
            turnoverCompleted: 0,
            isCompleted: false,
          },
        },
        { upsert: true, session }
      );

      const didInsert = (res as any).upsertedId || (res as any).upsertedCount === 1;
      if (didInsert) createdCount += 1;
    }

    if (createdCount === 0) {
      await session.commitTransaction();
      await session.endSession();
      return;
    }

    const amountToCredit = createdCount * unitSize;

    // Direct Mongo update (instead of Redis credit)
    const existingBalance = await UserBalance.findOne({ userId: referrerId }).session(session);
    const newBalance = (existingBalance?.currentBalance || 0) + amountToCredit;

    await UserBalance.updateOne(
      { userId: referrerId },
      { $set: { currentBalance: newBalance } },
      { session }
    );

    // Update reward summary
    await ReferralRewardModel.updateOne(
      { referrer: referrerId },
      {
        $inc: { totalReleasedTK: amountToCredit },
        $set: { totalPendingTK: Math.max(0, pendingTK - amountToCredit) },
      },
      { session }
    );

    await session.commitTransaction();
    await session.endSession();
  } catch (err) {
    try {
      await session.abortTransaction();
    } catch { }
    try {
      await session.endSession();
    } catch { }
    throw err;
  }
};
