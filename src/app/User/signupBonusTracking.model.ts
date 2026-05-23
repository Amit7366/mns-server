// src/models/signupBonusTracking.model.ts

import { Schema, model, Types } from 'mongoose';

const signupBonusTrackingSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: 'User', unique: true, required: true },
    bonusAmount: { type: Number, default: 70 },
    turnoverRequired: { type: Number, default: 210 },
    turnoverCompleted: { type: Number, default: 0 },
    isCompleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);
signupBonusTrackingSchema.index({ userId: 1, isCompleted: 1 });
export const SignupBonusTracking = model('SignupBonusTracking', signupBonusTrackingSchema);
