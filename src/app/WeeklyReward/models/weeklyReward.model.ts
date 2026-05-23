// ✅ src/models/weeklyReward.model.ts
import { Schema, model } from 'mongoose';

const weeklyRewardSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    weekStart: { type: Date, required: true },
    weekEnd: { type: Date, required: true },
    totalBets: { type: Number, required: true },
    totalWins: { type: Number, required: true },
    netLoss: { type: Number, required: true },
    vipTier: { type: String, required: true },
    cashbackPercent: { type: Number, required: true },
    cashbackAmount: { type: Number, required: true },
    isClaimed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const WeeklyRewardModel = model('WeeklyReward', weeklyRewardSchema);