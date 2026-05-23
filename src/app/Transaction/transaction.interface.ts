// transaction.interface.ts
import { Types } from 'mongoose';

export interface ITransaction {
  _id?: Types.ObjectId;
  userId: Types.ObjectId;
  id: string;
  paymentMethod: 'bkash' | 'nagad' | 'rocket';
  transactionType: 'deposit' | 'withdraw';
  amount: number;
  status: 'pending' | 'success' | 'failed';
  transactionId: string;
  proofImage?: string;
  promoCode?: string; // e.g. PROMO_150_SLOT
  agentNumber?: string; // for deposit
  walletNumber?: string; // for both deposit and withdraw
  accountHolderName?: string; // for withdraw wallet
  bonusAmount?: number;   // for transparency in logs

  invoiceId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}