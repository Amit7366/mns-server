import mongoose, { Schema, model, Model } from 'mongoose';
import { IGameTxnRecord } from './GameTxnRecord';


// ✅ Create a new interface (extend to include backup metadata if you want)
export interface IGameTxnRecordBackup extends IGameTxnRecord {
  backupReason?: string;   // optional: store why backup happened
  backupDate?: Date;       // when it was backed up
}

// ✅ Define schema
const gameTxnRecordBackupSchema = new Schema<IGameTxnRecordBackup>(
  {
    txnId:         { type: String, required: true },
    agencyUid:     { type: String, required: true },
    memberAccount: { type: String, required: true },
    sbmId:         { type: String, required: true, index: true },
    userBalanceId: { type: Schema.Types.ObjectId, ref: 'UserBalance', index: true },
    gameUid:       { type: String, required: true },
    gameRound:     { type: String },
    currencyCode:  { type: String, required: true },
    bet:           { type: Number, required: true },
    win:           { type: Number, required: true },
    providerTsUtc: { type: Date,   required: true },
    alreadyTaken:  { type: Boolean, default: false },
    // backup metadata
    backupReason:  { type: String },
    backupDate:    { type: Date, default: Date.now },
  },
  { timestamps: true, versionKey: false }
);

const COLLECTION = 'game_txn_record_backups';

export const GameTxnRecordBackup: Model<IGameTxnRecordBackup> =
  (mongoose.models.GameTxnRecordBackup as Model<IGameTxnRecordBackup>) ||
  model<IGameTxnRecordBackup>('GameTxnRecordBackup', gameTxnRecordBackupSchema, COLLECTION);
