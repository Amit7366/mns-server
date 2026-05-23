import { Types } from "mongoose";
import { TurnoverTracking } from "./turnoverTracking.model";

// utils/turnover.utils.ts (UPDATED)
export const resetOldTurnovers = async (userId: Types.ObjectId | string) => {
    // Deactivate any currently counting turnover docs, do NOT zero their numbers.
    await TurnoverTracking.updateMany(
        { userId, isActive: true },
        { $set: { isActive: false, countingWindowClosedAt: new Date() } }
    );
};
