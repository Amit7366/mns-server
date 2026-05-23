// userPromotion.route.ts

import express from 'express';
import { PromotionController } from './userPromotion.controller';
import { claimBonusController } from './turnoverClaim.controller';

const router = express.Router();

// Admin or frontend can fetch available promotions
router.get('/promotions', PromotionController.getAllPromotions);
// ✅ Claim completed turnover bonus
router.post('/claim-turnover-bonus', claimBonusController);

export const PromotionRoutes = router;
