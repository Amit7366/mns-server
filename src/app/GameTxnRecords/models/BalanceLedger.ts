import mongoose, { Schema, model, Model, Types } from 'mongoose';

export interface IBalanceLedger {
  txnId: string;                       // unique per game txn
  userBalanceId: Types.ObjectId;       // ref: UserBalance
  currencyCode: string;
  delta: number;                       // win - bet (can be negative)
  balanceAfter: number;                // balance after applying delta
}

const balanceLedgerSchema = new Schema<IBalanceLedger>(
  {
    txnId:         { type: String, required: true, unique: true },
    userBalanceId: { type: Schema.Types.ObjectId, required: true, ref: 'UserBalance', index: true },
    currencyCode:  { type: String, required: true },
    delta:         { type: Number, required: true },
    balanceAfter:  { type: Number, required: true },
  },
  { timestamps: true, versionKey: false }
);

// helpful read index
balanceLedgerSchema.index({ createdAt: 1 });

const COLLECTION = 'balance_ledger';

export const BalanceLedger: Model<IBalanceLedger> =
  (mongoose.models.BalanceLedger as Model<IBalanceLedger>) ||
  model<IBalanceLedger>('BalanceLedger', balanceLedgerSchema, COLLECTION);
