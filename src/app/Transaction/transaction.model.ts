// transaction.model.ts
import mongoose, { Schema } from 'mongoose';
import { ITransaction } from './transaction.interface';

const transactionSchema = new Schema<ITransaction>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    id: { type: String, required: true },
    paymentMethod: { type: String, enum: ['bkash', 'nagad', 'rocket'], required: true },
    transactionType: { type: String, enum: ['deposit', 'withdraw'], required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'success', 'failed'], default: 'pending' },
    transactionId: { type: String, required: true },
    proofImage: { type: String },
    invoiceId: { type: String },
    promoCode: { type: String },
    agentNumber: { type: String }, // for deposit
    walletNumber: { type: String }, // for both
    accountHolderName: { type: String }, // for withdraw wallet
    bonusAmount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Transaction = mongoose.model<ITransaction>('Transaction', transactionSchema);