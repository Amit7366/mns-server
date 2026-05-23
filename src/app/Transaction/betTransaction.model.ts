import mongoose, { Schema, Document } from "mongoose";

export interface IBetTransaction extends Document {
  userId: mongoose.Types.ObjectId;
  id: string; // sbm-prefixed ID
  amount: number; // win amount; 0 on lose/refund except refund record
  type: "win" | "lose" | "refund";
  status: "pending" | "completed" | "failed";
  cumulativeWin?: number;
  metadata: {
    gameId?: string;
    game_type?: string; // normalized: 'all' | 'slot' | 'fish' | 'live' | ...
    roundId?: string;
    serialNumber?: string;
    currencyCode?: string;
    betAmount?: number;
    callbackTimestamp?: number;
    externalTxnId: string; // 🔑 dedupe key
    provider?: string;
    isDuplicate?: boolean;
  };
}

const betTransactionSchema = new Schema<IBetTransaction>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    id: { type: String, required: true }, // sbm-prefixed ID
    amount: { type: Number, required: true },
    type: { type: String, enum: ["win", "lose", "refund"], required: true },
    status: { type: String, enum: ["pending", "completed", "failed"], default: "pending" },
    cumulativeWin: { type: Number, default: 0 },
    metadata: {
      gameId: String,
      game_type: { type: String, default: "all" },
      roundId: String,
      serialNumber: String,
      currencyCode: String,
      betAmount: Number,
      callbackTimestamp: Number,
      externalTxnId: { type: String, required: true },
      provider: String,
      isDuplicate: { type: Boolean, default: false },
    },
  },
  { timestamps: true, versionKey: false }
);

// ✅ Primary dedupe: never change this (matches your logic)
betTransactionSchema.index(
  { id: 1, "metadata.externalTxnId": 1 },
  { unique: true, name: "uniq_user_externalTxnId" }
);

// Helpful secondaries (fast filters / dashboards)
betTransactionSchema.index({ userId: 1, createdAt: -1 }, { name: "by_user_time" });
betTransactionSchema.index({ "metadata.provider": 1, createdAt: -1 }, { name: "by_provider_time" });
betTransactionSchema.index({ "metadata.externalTxnId": 1 }, { name: "by_externalTxnId" }); // audits
betTransactionSchema.index({ "metadata.game_type": 1, createdAt: -1 }, { name: "by_gameType_time" });

export const BetTransaction = mongoose.model<IBetTransaction>(
  "BetTransaction",
  betTransactionSchema
);
