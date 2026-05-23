// src/app/modules/recycle/recycle.assign.controller.ts
import httpStatus from "http-status";
import catchAsync from "../utilis/catchAsync";
import sendResponse from "../utilis/sendResponse";
import { RecycleAssignService } from "./recycle.assign.service";

export const RecycleAssignController = {
  assignOne: catchAsync(async (req, res) => {
    const { normalUserId } = req.params as any;
    const { customerOfficerId } = req.body as any;

    const result = await RecycleAssignService.assignOfficerToOne(normalUserId, customerOfficerId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Customer officer assigned successfully",
      data: result,
    });
  }),

  assignBulk: catchAsync(async (req, res) => {
    const { customerOfficerId, normalUserIds } = req.body as any;

    const result = await RecycleAssignService.assignOfficerBulk(normalUserIds, customerOfficerId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Customer officer assigned (bulk) successfully",
      data: result,
    });
  }),

  assignedList: catchAsync(async (req, res) => {
    const result = await RecycleAssignService.getAssignedUsers(req.query as any);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Assigned users fetched successfully",
      meta: result.meta,
      data: result.data,
    });
  }),
};
