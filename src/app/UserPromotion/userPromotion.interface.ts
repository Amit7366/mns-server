// userPromotion.interface.ts

import { Types } from 'mongoose';

export type TUsageType = 'always' | 'once' | 'daily';

export interface IUserPromotion {
  userId: Types.ObjectId;
  selectedPromoCode: string;
  bonusRate: number;
  turnoverX: number;
  eligibleGames: string[];
  maxWithdrawLimit: number | null;
  usageType: TUsageType;
  promoIsLocked: boolean;
  promoCode?: string; // unique code for the promotion
  bonusReceived?: number; // cumulative bonus for cap
  usedOnce?: boolean; // for once-only promos     
  lastUsedAt?: Date | null; // for daily cooldowns
  isRefunded?: boolean; // for refunded bonuses
  isClaimed?: boolean; // for claimed bonuses
  refundTrigger?: boolean; // for refund-triggered bonuses
  minDeposit?: Number,
  maxBonusCap?: Number,


  createdAt?: Date;
}
