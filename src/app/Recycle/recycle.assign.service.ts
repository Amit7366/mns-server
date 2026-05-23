// src/app/modules/recycle/recycle.assign.service.ts
import { Types } from "mongoose";
import { NormalUser } from "../NormalUser/normalUser.model";

type ListQuery = {
    customerOfficerId: string;
    page?: string;
    limit?: string;
    search?: string;
};

export const RecycleAssignService = {
    assignOfficerToOne: async (anyId: string, customerOfficerId: string) => {
  if (!Types.ObjectId.isValid(anyId)) throw new Error("Invalid id");

  const oid = new Types.ObjectId(anyId);

  const updated = await NormalUser.findOneAndUpdate(
    {
      $or: [{ _id: oid }, { user: oid }], // ✅ accept both ids
      customerOfficerId: null,
      isDeleted: { $ne: true },
    },
    { $set: { customerOfficerId } },
    { new: true }
  );

  if (!updated) throw new Error("User not found or already assigned");

  return updated;
},


    assignOfficerBulk: async (normalUserIds: string[], customerOfficerId: string) => {
        const ids = normalUserIds
            .filter((id) => Types.ObjectId.isValid(id))
            .map((id) => new Types.ObjectId(id));

        if (!ids.length) throw new Error("No valid normalUserIds provided");

        const result = await NormalUser.updateMany(
            { _id: { $in: ids }, customerOfficerId: null, isDeleted: { $ne: true } },
            { $set: { customerOfficerId } }
        );

        return {
            matched: result.matchedCount,
            modified: result.modifiedCount,
        };
    },


    getAssignedUsers: async (query: ListQuery) => {
        const page = Math.max(1, Number(query.page || 1));
        const limit = Math.min(100, Math.max(1, Number(query.limit || 100)));
        const skip = (page - 1) * limit;

        const q: any = {
            customerOfficerId: query.customerOfficerId,
            isDeleted: { $ne: true },
        };

        if (query.search && query.search.trim()) {
            const s = query.search.trim();
            q.$or = [
                { name: { $regex: s, $options: "i" } },
                { userName: { $regex: s, $options: "i" } },
                { id: { $regex: s, $options: "i" } },
                { contactNo: { $regex: s, $options: "i" } },
            ];
        }

        const [total, data] = await Promise.all([
            NormalUser.countDocuments(q),
            NormalUser.find(q)
                .sort({ updatedAt: -1 })
                .skip(skip)
                .limit(limit)
                .select("id name userName contactNo profileImg lastActiveAt engagementStatus userLevel status customerOfficerId user")
                .lean(),
        ]);

        return {
            meta: { total, page, limit },
            data,
        };
    },
};
