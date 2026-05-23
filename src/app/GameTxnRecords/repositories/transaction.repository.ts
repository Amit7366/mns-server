import { ClientSession, Types } from 'mongoose';
import { GameTxnRecord, IGameTxnRecord } from '../models/GameTxnRecord';
import { UserBalance } from '../../Transaction/userBalance.model';

export class TransactionRepository {
  // 🔹 Find existing user balance by sbmId string
  async findUserBalanceBySbmId(sbmId: string, session?: ClientSession) {
    return UserBalance.findOne({ id: sbmId }).session(session || null);
  }

  // 🔹 Insert transaction once per txnId (serial_number)
  async upsertTransaction(
    doc: IGameTxnRecord,
    session?: ClientSession
  ): Promise<'inserted' | 'duplicate'> {
    const res: any = await GameTxnRecord.updateOne(
      { txnId: doc.txnId },
      { $setOnInsert: doc },
      { upsert: true, session }
    );
    return res.upsertedCount && res.upsertedCount > 0 ? 'inserted' : 'duplicate';
  }

  // 🔹 Apply balance delta atomically
  async applyDelta(
    userBalanceId: Types.ObjectId,
    delta: number,
    session?: ClientSession
  ) {
    const updated = await UserBalance.findByIdAndUpdate(
      userBalanceId,
      { $inc: { currentBalance: delta } },
      { new: true, session }
    ).lean();

    if (!updated) throw new Error('UserBalance not found during update');
    return updated.currentBalance;
  }
}
