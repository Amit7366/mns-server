// models/referralBonusTracking.model.ts
import { Schema, model, Types } from 'mongoose';

const referralBonusTrackingSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: 'User', required: true }, // Referrer
    referredUserId: { type: Types.ObjectId, ref: 'User', required: true },
    bonusAmount: { type: Number, default: 500 },
    turnoverRequired: { type: Number, default: 4000 },
    turnoverCompleted: { type: Number, default: 0 },
    isCompleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);
referralBonusTrackingSchema.index({ userId: 1, isCompleted: 1 });
export const ReferralBonusTracking = model('ReferralBonusTracking', referralBonusTrackingSchema);
