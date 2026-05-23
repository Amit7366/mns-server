import { PipelineStage } from "mongoose";
import { NormalUser } from "../NormalUser/normalUser.model";

export const buildNoDepositBalancePipeline = ({
  page = 1,
  limit = 20,
  search,
}: {
  page?: number;
  limit?: number;
  search?: string;
}): PipelineStage[] => {
  const skip = (page - 1) * limit;

  const normalUsersCollection = NormalUser.collection.name; // usually "normalusers"

  const pipeline: PipelineStage[] = [
    // 1) No deposit users
    { $match: { totalDeposit: 0 } },

    // 2) Join NormalUser (UserBalance.userId == NormalUser.user)
    {
      $lookup: {
        from: normalUsersCollection,
        localField: "userId",
        foreignField: "user",
        as: "nu",
      },
    },
    { $unwind: "$nu" },

    // 3) Only unassigned (Rule A)
    {
      $match: {
        "nu.customerOfficerId": null,
        "nu.isDeleted": false,
      },
    },
  ];

  // optional search
  if (search && search.trim()) {
    const s = search.trim();
    pipeline.push({
      $match: {
        $or: [
          { "nu.name": { $regex: s, $options: "i" } },
          { "nu.userName": { $regex: s, $options: "i" } },
          { "nu.id": { $regex: s, $options: "i" } },
          { "nu.contactNo": { $regex: s, $options: "i" } },
        ],
      },
    });
  }

  // sort recent balance update first
  pipeline.push({ $sort: { updatedAt: -1, _id: -1 } });

  // paginate + total
  pipeline.push(
    {
      $facet: {
        meta: [{ $count: "total" }],
        data: [
          { $skip: skip },
          { $limit: limit },
          {
            $project: {
              _id: 0,
              userBalanceId: "$_id",
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
              updatedAt: 1,
              createdAt: 1,

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
      },
    }
  );

  return pipeline;
};

export const buildNoDepositBalanceAssignedPipeline = ({
  customerOfficerId,
  page = 1,
  limit = 20,
  search,
}: {
  customerOfficerId: string;
  page?: number;
  limit?: number;
  search?: string;
}): PipelineStage[] => {
  const skip = (page - 1) * limit;
  const normalUsersCollection = NormalUser.collection.name;

  const pipeline: PipelineStage[] = [
    { $match: { totalDeposit: 0 } },
    {
      $lookup: {
        from: normalUsersCollection,
        localField: "userId",
        foreignField: "user",
        as: "nu",
      },
    },
    { $unwind: "$nu" },
    {
      $match: {
        "nu.customerOfficerId": customerOfficerId,
        "nu.isDeleted": false,
      },
    },
  ];

  if (search && search.trim()) {
    const s = search.trim();
    pipeline.push({
      $match: {
        $or: [
          { "nu.name": { $regex: s, $options: "i" } },
          { "nu.userName": { $regex: s, $options: "i" } },
          { "nu.id": { $regex: s, $options: "i" } },
          { "nu.contactNo": { $regex: s, $options: "i" } },
        ],
      },
    });
  }

  pipeline.push({ $sort: { updatedAt: -1, _id: -1 } });

  pipeline.push(
    {
      $facet: {
        meta: [{ $count: "total" }],
        data: [
          { $skip: skip },
          { $limit: limit },
          {
            $project: {
              _id: 0,
              userBalanceId: "$_id",
              userId: 1,
              id: 1,
              totalDeposit: 1,
              updatedAt: 1,
              createdAt: 1,
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
      },
    }
  );

  return pipeline;
};
