// File: weeklyReward.controller.ts

import httpStatus from "http-status";
import { Request, Response } from "express";
import { UserBalance } from "../../Transaction/userBalance.model";
import sendResponse from "../../utilis/sendResponse";
import { WeeklyRewardModel } from "../models/weeklyReward.model";
import { getCurrentWeekRange } from "../utils/date.util";
import { getWeeklyRewards ,getUserReward, calculateWeeklyCashback} from "../services/weeklyReward.service"

export const claimWeeklyReward = async (
  req: Request<{}, {}, {}, { userId: string }>,
  res: Response
) => {
  try {
    const userId = req.query.userId;
    if (!userId) {
      return sendResponse(res, {
        statusCode: httpStatus.BAD_REQUEST,
        success: false,
        message: "userId is required in query params",
        data: null,
      });
    }

    const { start, end } = getCurrentWeekRange();

    const reward = await WeeklyRewardModel.findOne({
      userId,
      weekStart: start,
    });

    if (!reward) {
      return sendResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        success: false,
        message: "No reward available to claim for this week",
        data: null,
      });
    }

    if (reward.isClaimed) {
      return sendResponse(res, {
        statusCode: httpStatus.BAD_REQUEST,
        success: false,
        message: "Reward already claimed for this week",
        data: null,
      });
    }

    reward.isClaimed = true;
    await reward.save();

    // await UserBalance.findOneAndUpdate(
    //   { userId },
    //   {
    //     $inc: {
    //       currentBalance: reward.cashbackAmount || 0,
    //     },
    //   },
    //   { new: true, upsert: true }
    // );

    return sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Weekly cashback reward claimed successfully",
      data: reward,
    });
  } catch (error) {
    console.error("Claim Reward Error:", error);
    return sendResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      success: false,
      message: "Something went wrong",
      data: null,
    });
  }
};
export const getWeeklyRewardsAdmin = async (
  req: Request<{}, {}, {}, { userId?: string }>,
  res: Response
) => {
  try {
    const { userId } = req.query;
    const rewards = await getWeeklyRewards(userId);

    return sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Weekly rewards fetched successfully",
      data: rewards,
    });
  } catch (error) {
    console.error("Admin Weekly Reward Fetch Error:", error);
    return sendResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      success: false,
      message: "Something went wrong",
      data: null,
    });
  }
};

export const getUserWeeklyReward = async (
  req: Request<{}, {}, {}, { userId: string }>,
  res: Response
) => {
  try {
    const userId = req.query.userId;
    if (!userId) {
      return sendResponse(res, {
        statusCode: httpStatus.BAD_REQUEST,
        success: false,
        message: "userId is required",
        data: null,
      });
    }

    // First attempt to get reward
    let reward = await getUserReward(userId);

    // If not found, try to calculate cashback for all users
    if (!reward) {
      await calculateWeeklyCashback();
      reward = await getUserReward(userId);
    }

    if (!reward) {
      return sendResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        success: false,
        message: "No reward generated for this week yet",
        data: null,
      });
    }

    return sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Weekly reward fetched successfully",
      data: reward,
    });
  } catch (error) {
    console.error("User Weekly Reward Fetch Error:", error);
    return sendResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      success: false,
      message: "Something went wrong",
      data: null,
    });
  }
};

