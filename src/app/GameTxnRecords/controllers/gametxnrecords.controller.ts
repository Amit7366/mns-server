import { Request, Response } from "express";
import { GameTxnRecordsService } from "../services/gametxnrecords.service";

export class GameTxnRecordsController {
  private service = new GameTxnRecordsService();

  // GET /api/gametxnrecords/user-bets?sbmId=sbm47373
  getUserBets = async (req: Request, res: Response): Promise<void> => {
    try {
      const { sbmId } = req.query;

      if (!sbmId) {
        res.status(400).json({ message: "sbmId query parameter is required" });
        return;
      }

      const data = await this.service.getUserBets(sbmId.toString());
      if (!data) {
        res.status(404).json({ message: "No records found for this sbmId" });
        return;
      }

      res.json(data);
    } catch (err) {
      console.error("Error in getUserBets controller:", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
}
