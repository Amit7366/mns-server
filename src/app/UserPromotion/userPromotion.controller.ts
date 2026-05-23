// userPromotion.controller.ts

import { Request, Response } from 'express';
import { PROMOTION_LIST } from '../Promotion/promotion.constant';

export const PromotionController = {
  getAllPromotions: async (_req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      data: PROMOTION_LIST,
    });
  },
};
