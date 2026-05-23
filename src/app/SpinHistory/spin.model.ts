import { Schema, model } from "mongoose";

export type TSpinHistory = {
    sbmId: string; // same as UserBalance.id
    amount: number;
    claimedAt: Date;
    nextSpinAt: Date;
    ip?: string | null;
    ua?: string | null;
};

const spinHistorySchema = new Schema<TSpinHistory>(
    {
        sbmId: { type: String, required: true, index: true },
        amount: { type: Number, required: true },
        claimedAt: { type: Date, required: true, index: true },
        nextSpinAt: { type: Date, required: true },

        ip: { type: String, default: null },
        ua: { type: String, default: null },
    },
    { timestamps: true, versionKey: false }
);

spinHistorySchema.index({ sbmId: 1, claimedAt: -1 });

export const SpinHistory = model<TSpinHistory>("SpinHistory", spinHistorySchema);
