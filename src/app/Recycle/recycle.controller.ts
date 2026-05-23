// src/app/modules/recycle/recycle.controller.ts
import httpStatus from "http-status";
import catchAsync from "../utilis/catchAsync";
import sendResponse from "../utilis/sendResponse";
import { RecycleService } from "./recycle.service";

export const RecycleController = {
  list: catchAsync(async (req, res) => {
    const result = await RecycleService.getRecycleList(req.query);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message:
        "Recycle list fetched successfully (success deposit older than 72h, unassigned)",
      data: result,
    });
  }),
};
