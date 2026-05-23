import httpStatus from "http-status";
import catchAsync from "../utilis/catchAsync";
import sendResponse from "../utilis/sendResponse";
import { RecycleBonusService } from "./recycle.bonus.service";

export const RecycleBonusController = {
  give: catchAsync(async (req, res) => {
    const { userId, amount } = req.body;

    const result = await RecycleBonusService.giveBonus(userId, amount);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Recycle/Retention bonus added to currentBalance successfully",
      data: result,
    });
  }),
};
