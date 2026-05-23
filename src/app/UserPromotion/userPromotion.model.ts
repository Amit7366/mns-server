// userPromotion.model.ts

import { Schema, model } from 'mongoose';

const userPromotionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      unique: true,
      required: true,
    },
    selectedPromoCode: {
      type: String,
      required: false,
    },
    bonusRate: Number,
    turnoverX: Number,
    eligibleGames: [String],
    maxWithdrawLimit: {
      type: Number,
      default: null,
    },
    usageType: {
      type: String,
      enum: ['always', 'once', 'daily'],
    },
    promoIsLocked: {
      type: Boolean,
      default: true,
    },
    promoCode: {
      type: String,
      // Ensure promo codes are unique
      required: false, // Optional, can be used for specific promotions
    },
    // Add these fields in userPromotionSchema
    bonusReceived: { type: Number, default: 0 }, // ✅ track cumulative bonus for cap
    usedOnce: { type: Boolean, default: false }, // ✅ for once-only promos
    lastUsedAt: { type: Date, default: null }, // ✅ for daily cooldowns
    refundTrigger: {
      type: Boolean,
      default: false, // ✅ for refund-triggered bonuses
    },
    minDeposit: {
      type: Number, // ✅ minimum deposit required for the promotion
      required: false,
      default: 0,
    },
    maxBonusCap: {
      type: Number, // ✅ maximum cumulative bonus allowed for this promotion                 
      required: false,
      default: null,
    }


  },
  { timestamps: true }
);

export const UserPromotion = model('UserPromotion', userPromotionSchema);
