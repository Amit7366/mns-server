import { Request, Response } from "express";
import { updateWallet } from "./wallet.service";
import { decryptViaPhp, encryptViaPhp } from "./phpCrypto.service";

export async function handleCallback(req: Request, res: Response) {
  try {
    console.log("📥 CALLBACK RECEIVED:", req.body);

    const { payload, timestamp } = req.body;

    if (!payload || !timestamp) {
      return res.json({ code: 1, msg: "Missing payload or timestamp" });
    }

    // 🔓 PHP decryption
    const decrypted = await decryptViaPhp(payload);
    console.log("🎲 DECRYPTED BET:", decrypted);

    // Use decrypted credit_amount (provider already processed the bet)
    const balance = Number(decrypted.credit_amount);

    // 🔐 PHP encryption for response
    const responsePayload = await encryptViaPhp({
      credit_amount: balance.toFixed(2),
      timestamp: Date.now().toString()
    });

    return res.json({
      code: 0, // always 0 if processed
      msg: "",
      payload: responsePayload
    });

  } catch (err: any) {
    console.error("❌ CALLBACK ERROR:", err);

    const responsePayload = await encryptViaPhp({
      credit_amount: "0.00",
      timestamp: Date.now().toString()
    });

    return res.json({
      code: 1,
      msg: "Processing error",
      payload: responsePayload
    });
  }
}
// 🔧 Postman helper (for testing only)
export async function generateTestPayload(req: Request, res: Response) {
  const sampleBet = {
    serial_number: "TEST-1001",
    member_account: "sbm47373",
    bet_amount: "10",
    win_amount: "25",
    currency_code: "BDT",
    game_uid: "TEST_GAME",
    timestamp: Date.now().toString(),
    game_round: "ROUND-001",
    data: {}
  };

  const payload = await encryptViaPhp(sampleBet);
  res.json({ payload });
}



