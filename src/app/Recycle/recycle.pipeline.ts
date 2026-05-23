// src/app/modules/recycle/recycle.pipeline.ts
import { PipelineStage } from "mongoose";
import { NormalUser } from "../NormalUser/normalUser.model";

export const buildRecyclePipeline = ({
  days = 3,
  page = 1,
  limit = 20,
  search,
}: {
  days?: number;
  page?: number;
  limit?: number;
  search?: string;
}): PipelineStage[] => {
  const skip = (page - 1) * limit;
  const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  // ✅ Use real collection name (prevents "from" mistakes)
  const normalUsersCollection = NormalUser.collection.name; // usually "normalusers"

  const searchStage: PipelineStage | null =
    search && search.trim()
      ? {
          $match: {
            $or: [
              { "nu.name": { $regex: search.trim(), $options: "i" } },
              { "nu.userName": { $regex: search.trim(), $options: "i" } },
              { "nu.id": { $regex: search.trim(), $options: "i" } },
              { "nu.contactNo": { $regex: search.trim(), $options: "i" } },
            ],
          },
        }
      : null;

  const pipeline: PipelineStage[] = [
    // 1) only successful deposits
    {
      $match: {
        transactionType: "deposit",
        status: "success",
      },
    },

    // 2) per user -> last successful deposit date
    {
      $group: {
        _id: "$userId",
        lastSuccessDepositAt: { $max: "$createdAt" },
        successDepositCount: { $sum: 1 },
        totalSuccessDeposit: { $sum: "$amount" },
      },
    },

    // 3) last deposit older than cutoff (72h default)
    {
      $match: {
        lastSuccessDepositAt: { $lt: cutoff },
      },
    },

    // 4) join NormalUser by NormalUser.user == Transaction.userId
    {
      $lookup: {
        from: normalUsersCollection,
        localField: "_id",
        foreignField: "user",
        as: "nu",
      },
    },
    { $unwind: "$nu" },

    // 5) Rule A: only unassigned + not deleted
    {
      $match: {
        "nu.customerOfficerId": null,
        "nu.isDeleted": false,
        // "nu.status": "active", // optional
      },
    },

    ...(searchStage ? [searchStage] : []),

    // 6) most urgent first (oldest last deposit)
    { $sort: { lastSuccessDepositAt: 1 } },

    // 7) paginate + total
    {
      $facet: {
        meta: [{ $count: "total" }],
        data: [
          { $skip: skip },
          { $limit: limit },
          {
            $project: {
              _id: 0,
              userObjectId: "$_id",
              lastSuccessDepositAt: 1,
              successDepositCount: 1,
              totalSuccessDeposit: 1,

              normalUser: {
                _id: "$nu._id",
                user: "$nu.user",
                id: "$nu.id",
                name: "$nu.name",
                userName: "$nu.userName",
                contactNo: "$nu.contactNo",
                profileImg: "$nu.profileImg",
                lastActiveAt: "$nu.lastActiveAt",
                engagementStatus: "$nu.engagementStatus",
                userLevel: "$nu.userLevel",
                status: "$nu.status",
                customerOfficerId: "$nu.customerOfficerId",
              },
            },
          },
        ],
      },
    },

    {
      $project: {
        total: { $ifNull: [{ $arrayElemAt: ["$meta.total", 0] }, 0] },
        data: 1,
        cutoff: { $literal: cutoff },
      },
    },
  ];

  return pipeline;
};
