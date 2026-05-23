// models/loginBonusTracking.model.ts

import { Schema, model, Types } from 'mongoose';

const loginBonusTrackingSchema = new Schema(
    {
        userId: { type: Types.ObjectId, ref: 'User', required: true },
        bonusAmount: { type: Number, required: true },
        depositAmount: { type: Number, required: true },
        turnoverRequired: { type: Number, required: true },
        turnoverCompleted: { type: Number, default: 0 },
        isCompleted: { type: Boolean, default: false },
    },
    { timestamps: true }
);
loginBonusTrackingSchema.index({ userId: 1, isCompleted: 1 });
export const LoginBonusTracking = model('LoginBonusTracking', loginBonusTrackingSchema);
