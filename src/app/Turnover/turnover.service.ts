import { UserBalance } from "../Transaction/userBalance.model";
import { ITurnover } from "./turnover.interface";

import { Types } from "mongoose";
import { TurnoverActivity } from "./turnover.model";

const BONUS_TIERS = [
  { threshold: 10000, bonus: 40 },
  { threshold: 1000, bonus: 1 },
];

export const createTurnover = async (data: ITurnover) => {
  const turnover = new TurnoverActivity(data);
  await turnover.save();
  await calculateTurnoverBonus(data.userId.toString());
  return turnover;
};

export const getUserTurnover = async (userId: string | Types.ObjectId, days?: number) => {
  const userObjectId = typeof userId === 'string' ? new Types.ObjectId(userId) : userId;
  const match: any = { userId: userObjectId };

  if (days) {
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - days);
    match.timestamp = { $gte: fromDate };
  }

  return await TurnoverActivity.aggregate([
    { $match: match },
    {
      $group: {
        _id: '$userId',
        totalTurnover: { $sum: '$amount' },
      },
    },
  ]);
};

export const getAdminTurnoverReport = async () => {
  return await TurnoverActivity.aggregate([
    {
      $group: {
        _id: '$gameType',
        totalAmount: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
    { $sort: { totalAmount: -1 } },
  ]);
};

export const calculateTurnoverBonus = async (userId: string | Types.ObjectId) => {
  const userObjectId = typeof userId === 'string' ? new Types.ObjectId(userId) : userId;

  const result = await TurnoverActivity.aggregate([
    { $match: { userId: userObjectId } },
    {
      $group: {
        _id: '$userId',
        totalTurnover: { $sum: '$amount' },
      },
    },
  ]);

  const totalTurnover = result[0]?.totalTurnover || 0;
  let bonusCoins = 0;

  for (const tier of BONUS_TIERS) {
    if (totalTurnover >= tier.threshold) {
      bonusCoins = tier.bonus;
      break;
    }
  }

  if (bonusCoins > 0) {
    // await UserBalance.findOneAndUpdate(
    //   { userId: userObjectId },
    //   {
    //     $inc: {
    //       currentCoinBalance: bonusCoins,
    //       totalCoinDeposit: bonusCoins,
    //     },
    //   },
    //   { upsert: true } // ensure a record exists or is created
    // );
  }
};

export const getTurnoverGroupedByGameTypePerDay = async (userId: string | Types.ObjectId) => {
  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - 6);
  fromDate.setHours(0, 0, 0, 0);

  const userObjectId = typeof userId === 'string' ? new Types.ObjectId(userId) : userId;

  return await TurnoverActivity.aggregate([
    {
      $match: {
        userId: userObjectId,
        timestamp: { $gte: fromDate },
      },
    },
    {
      $group: {
        _id: {
          date: {
            $dateToString: { format: '%Y-%m-%d', date: '$timestamp' },
          },
          gameType: '$gameType',
        },
        totalAmount: { $sum: '$amount' },
      },
    },
    {
      $group: {
        _id: '$_id.date',
        types: {
          $push: {
            gameType: '$_id.gameType',
            amount: '$totalAmount',
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        date: '$_id',
        types: 1,
      },
    },
    { $sort: { date: 1 } },
  ]);
};
