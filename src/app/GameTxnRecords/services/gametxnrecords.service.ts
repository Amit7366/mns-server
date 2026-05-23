import mongoose from "mongoose";
import { GameTxnRecord } from "../models/GameTxnRecord";

export class GameTxnRecordsService {
  async getUserBets(sbmId: string) {
    const data = await GameTxnRecord.aggregate([
      {
        $match: { sbmId }
      },
      {
        $lookup: {
          from: "gamecatalogs",
          localField: "gameUid",
          foreignField: "game_code",
          as: "gameInfo"
        }
      },
      {
        $unwind: {
          path: "$gameInfo",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $group: {
          _id: null,
          totalBets: { $sum: "$bet" },
          totalWins: { $sum: "$win" },
          history: {
            $push: {
              txnId: "$txnId",
              gameRound: "$gameRound",
              bet: "$bet",
              win: "$win",
              currencyCode: "$currencyCode",
              providerTsUtc: "$providerTsUtc",
              game: {
                name: "$gameInfo.game_name",
                code: "$gameInfo.game_code",
                provider: "$gameInfo.provider",
                type: "$gameInfo.game_type"
              }
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          totalBets: 1,
          totalWins: 1,
          history: 1
        }
      }
    ]);

    return data[0] || null;
  }
}
