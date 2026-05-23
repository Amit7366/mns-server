// src/UserWallet/userWallet.model.ts
import { Schema, model, Types } from 'mongoose';

export enum WalletType {
  E_WALLET = 'ewallet',
  BANK = 'bank',
}

const userWalletSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: 'User', required: true },
    walletType: {
      type: String,
      enum: Object.values(WalletType),
      required: true,
    },
    walletName: { type: String, required: true }, // e.g., bkash, nagad
    accountHolderName: { type: String, required: true },
    walletNumber: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export const UserWallet = model('UserWallet', userWalletSchema);
