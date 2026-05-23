import httpStatus from "http-status";
import AppError from "../errors/AppError";
import { MyFavouriteCustomer } from "./myFavouriteCustomer.model";

const createFavouriteCustomer = async (payload: {
    userName: string;
    contactNo: string;
    sbmId: string;
    adminId: string; // ✅ A-0001
}) => {
    const exists = await MyFavouriteCustomer.findOne({
        adminId: payload.adminId,
        sbmId: payload.sbmId,
    }).lean();

    if (exists) {
        throw new AppError(httpStatus.CONFLICT, "Already added to favourites");
    }

    const created = await MyFavouriteCustomer.create(payload);
    return created;
};

const getFavouritesByAdminId = async (
  adminId: string,
  options?: { page?: number; limit?: number }
) => {
  const page = Math.max(1, Number(options?.page || 1));
  const limit = Math.min(200, Math.max(1, Number(options?.limit || 50)));
  const skip = (page - 1) * limit;

  // ✅ MATCH favourites by adminId
  const matchStage = { adminId };

  const [rows, totalArr] = await Promise.all([
    MyFavouriteCustomer.aggregate([
      { $match: matchStage },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },

      // ✅ "populate" from userbalances by matching sbmId -> userbalances.id
      {
        $lookup: {
          from: "userbalances", // ⚠️ change if your actual collection name is different
          let: { favSbmId: "$sbmId" },
          pipeline: [
            { $match: { $expr: { $eq: ["$id", "$$favSbmId"] } } },
            {
              $project: {
                _id: 1,
                userId: 1,
                id: 1,
                totalDeposit: 1,
                totalWithdraw: 1,
                currentBalance: 1,
                currentCoinBalance: 1,
                storeDbBalance: 1,
                totalCoinDeposit: 1,
                totalCoinWithdraw: 1,
                lockedBalance: 1,
                lastSpinAmount: 1,
                lastSpinAt: 1,
                nextSpinAt: 1,
                totalSpinWon: 1,
                createdAt: 1,
                updatedAt: 1,
              },
            },
          ],
          as: "userBalance",
        },
      },

      // ✅ convert [balance] -> balance (or null)
      {
        $addFields: {
          userBalance: { $ifNull: [{ $arrayElemAt: ["$userBalance", 0] }, null] },
        },
      },
    ]),

    MyFavouriteCustomer.aggregate([{ $match: matchStage }, { $count: "total" }]),
  ]);

  const total = totalArr?.[0]?.total || 0;

  return {
    meta: { total, page, limit },
    data: rows,
  };
};

export const MyFavouriteCustomerService = {
    createFavouriteCustomer,
    getFavouritesByAdminId,
};
