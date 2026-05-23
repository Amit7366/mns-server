// turnoverActivity.model.ts

import { Schema, model } from 'mongoose';
import { ITurnover } from './turnover.interface';

const TurnoverActivitySchema = new Schema<ITurnover>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    gameType: {
      type: String,
      enum: ['sports', 'casino', 'lottery', 'other'],
      required: true,
    },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// ✅ Use different model name to avoid conflict
export const TurnoverActivity = model<ITurnover>('TurnoverActivity', TurnoverActivitySchema);
