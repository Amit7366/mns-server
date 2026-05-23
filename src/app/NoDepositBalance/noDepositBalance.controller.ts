import httpStatus from "http-status";
import catchAsync from "../utilis/catchAsync";
import sendResponse from "../utilis/sendResponse";
import { NoDepositBalanceService } from "./noDepositBalance.service";

export const NoDepositBalanceController = {
    list: catchAsync(async (req, res) => {
        const result = await NoDepositBalanceService.getList(req.query);

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "No-deposit users (from Balance.totalDeposit=0) fetched successfully",
            data: result,
        });
    }),

    assigned: catchAsync(async (req, res) => {
        const result = await NoDepositBalanceService.getAssigned(req.query as any);

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Assigned no-deposit users (from Balance) fetched successfully",
            data: result,
        });
    }),

    assignOne: catchAsync(async (req, res) => {
        const { userId } = req.params as any;
        const { customerOfficerId } = req.body as any;

        const result = await NoDepositBalanceService.assignOne(userId, customerOfficerId);

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Customer officer assigned successfully (no-deposit-balance)",
            data: result,
        });
    }),

    assignBulk: catchAsync(async (req, res) => {
        const { customerOfficerId, userIds } = req.body as any;

        const result = await NoDepositBalanceService.assignBulk(userIds, customerOfficerId);

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Customer officer assigned (bulk) successfully (no-deposit-balance)",
            data: result,
        });
    }),
};
