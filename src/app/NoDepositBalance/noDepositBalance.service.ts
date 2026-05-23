import { Types } from "mongoose";
import { NormalUser } from "../NormalUser/normalUser.model";
import {
  buildNoDepositBalanceAssignedPipeline,
  buildNoDepositBalancePipeline,
} from "./noDepositBalance.pipeline";
import { UserBalance } from "../Transaction/userBalance.model";

type ListQuery = { page?: string; limit?: string; search?: string };
type AssignedQuery = { customerOfficerId: string; page?: string; limit?: string; search?: string };

type AggResult = { total: number; data: any[] };

export const NoDepositBalanceService = {
  getList: async (query: ListQuery) => {
    const page = Math.max(1, Number(query.page || 1));
    const limit = Math.min(100, Math.max(1, Number(query.limit || 20)));
    const search = query.search ? String(query.search) : undefined;

    const pipeline = buildNoDepositBalancePipeline({ page, limit, search });
    const agg = await UserBalance.aggregate<AggResult>(pipeline);
    const result = agg?.[0];

    return {
      total: result?.total || 0,
      page,
      limit,
      data: result?.data || [],
    };
  },

  getAssigned: async (query: AssignedQuery) => {
    const page = Math.max(1, Number(query.page || 1));
    const limit = Math.min(100, Math.max(1, Number(query.limit || 20)));
    const search = query.search ? String(query.search) : undefined;

    const pipeline = buildNoDepositBalanceAssignedPipeline({
      customerOfficerId: query.customerOfficerId,
      page,
      limit,
      search,
    });

    const agg = await UserBalance.aggregate<AggResult>(pipeline);
    const result = agg?.[0];

    return {
      total: result?.total || 0,
      page,
      limit,
      data: result?.data || [],
    };
  },

  // PATCH /no-deposit-balance/assign/:normalUserId
  assignOne: async (userId: string, customerOfficerId: string) => {
    if (!Types.ObjectId.isValid(userId)) throw new Error("Invalid userId");
    const uid = new Types.ObjectId(userId);

    // must still be no-deposit in UserBalance
    const eligible = await UserBalance.exists({ userId: uid, totalDeposit: 0 });
    if (!eligible) throw new Error("User already deposited (not eligible)");

    // update NormalUser by matching user field
    const updated = await NormalUser.findOneAndUpdate(
      {
        user: uid,
        customerOfficerId: null,
        isDeleted: { $ne: true },
      },
      { $set: { customerOfficerId } },
      { new: true }
    );

    if (!updated) throw new Error("User not found or already assigned");

    return updated;
  },

  // ✅ bulk assign by USER IDs
  assignBulk: async (userIds: string[], customerOfficerId: string) => {
    const uids = userIds
      .filter((id) => Types.ObjectId.isValid(id))
      .map((id) => new Types.ObjectId(id));

    if (!uids.length) throw new Error("No valid userIds provided");

    // eligible by balance.totalDeposit=0
    const eligibleBalances = await UserBalance.find({
      userId: { $in: uids },
      totalDeposit: 0,
    }).select("userId");

    const eligibleUserIds = eligibleBalances.map((b) => b.userId);

    if (!eligibleUserIds.length) return { matched: 0, modified: 0 };

    // update normal users that match eligible userIds and currently unassigned
    const result = await NormalUser.updateMany(
      {
        user: { $in: eligibleUserIds },
        customerOfficerId: null,
        isDeleted: { $ne: true },
      },
      { $set: { customerOfficerId } }
    );

    return {
      matched: result.matchedCount,
      modified: result.modifiedCount,
    };
  },
};
