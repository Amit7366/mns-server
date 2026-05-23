import httpStatus from "http-status";

import { MyFavouriteCustomerService } from "./myFavouriteCustomer.service";
import catchAsync from "../utilis/catchAsync";
import sendResponse from "../utilis/sendResponse";

const create = catchAsync(async (req, res) => {
    const result = await MyFavouriteCustomerService.createFavouriteCustomer(req.body);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Favourite customer added successfully",
        data: result,
    });
});

const getByAdmin = catchAsync(async (req, res) => {
    const { adminId, page, limit } = req.query as {
        adminId: string;
        page?: string;
        limit?: string;
    };

    const result = await MyFavouriteCustomerService.getFavouritesByAdminId(adminId, {
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
    });

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Favourite customers fetched successfully",
        meta: result.meta,
        data: result.data,
    });
});

export const MyFavouriteCustomerController = { create, getByAdmin };
