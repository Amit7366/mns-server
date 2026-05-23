import { Request, Response } from 'express';
import { adminGetAllBetHistoryService, getUserBetHistoryService } from './betTxn.service';


export const BetTxnController = {
  getUserBetHistory: async (req: Request, res: Response) => {
    try {
      const {
        userId, // required by validation
        page,
        limit,
        type,
        provider,
        game_type,
        from,
        to,
        search,
      } = req.query as any;

      // Safety: a user may only read their own history
      const requesterId = (req.user as any)?.objectId || (req.user as any)?._id;
      if (!requesterId || String(requesterId) !== String(userId)) {
        return res.status(403).json({ message: 'Forbidden: cannot read other user history' });
      }

      const result = await getUserBetHistoryService({
        userId,
        page: Number(page) || 1,
        limit: Number(limit) || 20,
        type,
        provider,
        game_type,
        from,
        to,
        search,
      });

      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ message: 'Failed to fetch user bet history', error: error.message });
    }
  },

  adminGetAllBetHistory: async (req: Request, res: Response) => {
    try {
      const {
        page,
        limit,
        userId,
        type,
        provider,
        game_type,
        from,
        to,
        search,
      } = req.query as any;

      const result = await adminGetAllBetHistoryService({
        page: Number(page) || 1,
        limit: Number(limit) || 20,
        userId,
        type,
        provider,
        game_type,
        from,
        to,
        search,
      });

      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ message: 'Failed to fetch admin bet history', error: error.message });
    }
  },
};
