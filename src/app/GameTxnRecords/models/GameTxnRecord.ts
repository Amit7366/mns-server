import mongoose, { Schema, model, Model, Types } from 'mongoose';

export interface IGameTxnRecord {
  txnId: string;                  // unique transaction ID
  agencyUid: string;
  memberAccount: string;          // e.g. "hfb20f_sbm47457_1fac6d"
  sbmId: string;                  // parsed "sbm47457"
  userId: Types.ObjectId;         // ✅ directly embedded user reference
  userBalanceId?: Types.ObjectId; // optional, for backref/debug
  gameUid: string;
  gameRound?: string | null;
  currencyCode: string;
  bet: number;
  win: number;
  providerTsUtc: Date;
  alreadyTaken?: boolean; // for future use
}

const gameTxnRecordSchema = new Schema<IGameTxnRecord>(
  {
    txnId:         { type: String, required: true, unique: true },
    agencyUid:     { type: String, required: true },
    memberAccount: { type: String, required: true },
    sbmId:         { type: String, required: true, index: true },
    userId:        { type: Schema.Types.ObjectId, required: true, ref: 'User', index: true }, // ✅ new
    userBalanceId: { type: Schema.Types.ObjectId, ref: 'UserBalance' },
    gameUid:       { type: String, required: true },
    gameRound:     { type: String },
    currencyCode:  { type: String, required: true },
    bet:           { type: Number, required: true },
    win:           { type: Number, required: true },
    providerTsUtc: { type: Date,   required: true },
    alreadyTaken:  { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false }
);

// ✅ Efficient indexes for querying and aggregation
gameTxnRecordSchema.index({ userId: 1, providerTsUtc: -1 });
gameTxnRecordSchema.index({ txnId: 1 }, { unique: true });
gameTxnRecordSchema.index({ sbmId: 1 });

const COLLECTION = 'game_txn_records';

export const GameTxnRecord: Model<IGameTxnRecord> =
  (mongoose.models.GameTxnRecord as Model<IGameTxnRecord>) ||
  model<IGameTxnRecord>('GameTxnRecord', gameTxnRecordSchema, COLLECTION);
