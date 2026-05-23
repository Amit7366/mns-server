import { Types } from "mongoose";
import { UserBalance } from "../Transaction/userBalance.model";

export const RecycleBonusService = {
  giveBonus: async (userId: string, amount: number) => {
    if (!Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid userId");
    }
    if (!amount || amount <= 0) {
      throw new Error("amount must be > 0");
    }

    const uid = new Types.ObjectId(userId);

    const updated = await UserBalance.findOneAndUpdate(
      { userId: uid },
      [
        {
          $set: {
            // ✅ if currentBalance is negative -> treat as 0, then add amount
            currentBalance: {
              $add: [{ $max: [{ $ifNull: ["$currentBalance", 0] }, 0] }, amount],
            },

            // ✅ storeDbBalance always increases by amount
            storeDbBalance: {
              $add: [{ $ifNull: ["$storeDbBalance", 0] }, amount],
            },
          },
        },
      ],
      { new: true }
    );

    if (!updated) {
      throw new Error("UserBalance not found for this userId");
    }

    return updated;
  },
};
