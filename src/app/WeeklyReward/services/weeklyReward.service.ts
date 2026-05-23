// File: weeklyReward.service.ts

import httpStatus from "http-status";
import { BetTransaction } from "../../Transaction/betTransaction.model";
import { User } from "../../User/user.model";
import { WeeklyRewardModel } from "../models/weeklyReward.model";
import { getCashbackPercent } from "../utils/cashback.util";
import { getCurrentWeekRange } from "../utils/date.util";
import sendResponse from "../../utilis/sendResponse";
import { Request, Response } from "express";

export const calculateWeeklyCashback = async () => {
  const { start, end } = getCurrentWeekRange();

  const aggregation = await BetTransaction.aggregate([
  {
    $match: {
      createdAt: { $gte: start, $lte: end },
      status: 'completed',
    },
  },
  {
    $group: {
      _id: '$userId',
      totalBets: { $sum: '$metadata.betAmount' },
      totalWins: {
        $sum: {
          $cond: [{ $gt: ['$amount', 0] }, '$amount', 0],
        },
      },
    },
  },
]);


 for (const record of aggregation) {
  const user = await User.findById(record._id).lean();
  if (!user) continue;

  const netLoss = record.totalBets - record.totalWins;
  if (netLoss <= 0) continue;

  const vipTier: string = user.userLevel?.toString() || 'Bronze';
  const cashbackPercent = getCashbackPercent(vipTier, netLoss);
  const cashbackAmount = Math.floor(netLoss * cashbackPercent);

  console.log({
    userId: record._id,
    totalBets: record.totalBets,
    totalWins: record.totalWins,
    netLoss,
    cashbackPercent,
    cashbackAmount,
  });

  await WeeklyRewardModel.updateOne(
    { userId: user._id, weekStart: start },
    {
      $set: {
        userId: user._id,
        weekStart: start,
        weekEnd: end,
        totalBets: record.totalBets,
        totalWins: record.totalWins,
        netLoss,
        vipTier,
        cashbackPercent,
        cashbackAmount,
      },
    },
    { upsert: true }
  );
}

};
export const getWeeklyRewards = async (userId?: string) => {
  const { start } = getCurrentWeekRange();

  const filter: Record<string, any> = {
    weekStart: start,
  };

  if (userId) {
    filter.userId = userId;
  }

  const rewards = await WeeklyRewardModel.find(filter)
    .sort({ cashbackAmount: -1 })
    .lean();

  return rewards;
};
export const getUserReward = async (userId: string) => {
  const { start } = getCurrentWeekRange();

  const reward = await WeeklyRewardModel.findOne({
    userId,
    weekStart: start,
  }).lean();

  return reward;
};