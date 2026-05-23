// models/TurnoverTracking.ts
import { Schema, model, Types } from 'mongoose';

const turnoverTrackingSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: 'User', required: true },

    // Link to the exact deposit txn this turnover belongs to
    depositId: { type: Types.ObjectId, ref: 'Transaction', index: true },

    // Also store the binding explicitly for clarity/audits (same as depositId)
    appliesToDepositId: { type: Types.ObjectId, ref: 'Transaction', index: true },

    // Amounts
    depositAmount: { type: Number, default: 0 },
    bonusAmount: { type: Number, default: 0 },

    // Progress
    turnoverRequired: { type: Number, required: true },
    turnoverCompleted: { type: Number, default: 0 },

    // Eligibility
    eligibleGameTypes: { type: [String], default: ['all'] }, // e.g., ['slot','fish','all']

    // State
    isCompleted: { type: Boolean, default: false },
    isClaimed: { type: Boolean, default: false },
    maxWithdraw: { type: Number, default: null },

    // NEW: active window control (only one should be true at a time per user)
    isActive: { type: Boolean, default: false, index: true },
    countingWindowClosedAt: { type: Date, default: null },

    // Meta: unify all trackers with a source + promo fields
    source: {
      type: String,
      enum: ['promotion', 'signup', 'referral', 'login', 'refund', 'cashback', 'system'],
      default: 'promotion',
    },
    promoCode: { type: String },
    usageType: {
      type: String,
      enum: ['always', 'once', 'daily', 'none'],
      default: 'always',
    },

    // Refund trigger support
    refundTrigger: { type: Boolean, default: false },
    isRefunded: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false }
);

// Indexes (keep routing fast & clean)
turnoverTrackingSchema.index({ userId: 1, isActive: 1 });                   // pick the active doc quickly
turnoverTrackingSchema.index({ userId: 1, isCompleted: 1 });
turnoverTrackingSchema.index({ userId: 1, isCompleted: 1, refundTrigger: 1, usageType: 1 });
turnoverTrackingSchema.index({ userId: 1, source: 1, promoCode: 1, isCompleted: 1 });
turnoverTrackingSchema.index({ userId: 1, createdAt: 1 });                  // helpful for latest-per-user

export const TurnoverTracking = model('Turnover', turnoverTrackingSchema);
