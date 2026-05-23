// src/UserPromotion/turnoverClaim.controller.ts

import { Request, Response } from 'express';

import httpStatus from 'http-status';
import catchAsync from '../utilis/catchAsync';
import sendResponse from '../utilis/sendResponse';
import { claimCompletedTurnoverBonus } from './turnoverClaim.service';


export const claimBonusController = catchAsync(async (req: Request, res: Response) => {
  const userId = req.query.userId as string;
  const result = await claimCompletedTurnoverBonus(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.message,
    data: { bonusAmount: result.amount },
  });
});
