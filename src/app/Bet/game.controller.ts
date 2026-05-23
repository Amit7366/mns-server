// src/controllers/game.controller.ts
import { Request, Response } from "express";

const GAME_API_URL = "https://account.24gameapi.org/api/gameLaunch.php";
const GAME_API_KEY = "8313eb45b0a212e0718b929849705972";
const AGENCY_UID_DEFAULT = "hfb20f";   // prefix
const API_SUFFIX_DEFAULT = process.env.GAME_API_SUFFIX || "1fac6d"; // suffix

type LaunchGameResponse = {
  code: number;
  msg?: string;
  game_launch_url?: string;
};

const fromReq = <T>(req: Request, key: string, fallback?: T): T => {
  const v = (req.body?.[key] ?? req.query?.[key] ?? req.params?.[key]) as T;
  if (v === undefined || v === null) {
    if (fallback !== undefined) return fallback as T;
    throw new Error(`Missing required field: ${key}`);
  }
  return v;
};

export const launchGame = async (req: Request, res: Response) => {
  try {
    const gameCode = fromReq<string>(req, "gameCode");
    const userId = fromReq<string>(req, "userId") || "guest";

    // allow override via request, else defaults
    const agencyUid = fromReq<string>(req, "agencyUid", AGENCY_UID_DEFAULT); // PREFIX
    const apiSuffix = fromReq<string>(req, "apiSuffix", API_SUFFIX_DEFAULT); // SUFFIX

    const homeUrl = fromReq<string>(req, "homeUrl", "https://bm24api.xyz");
    const userBalance = Number(fromReq<string | number>(req, "userBalance", 0));
    if (!Number.isFinite(userBalance) || userBalance < 0) {
      return res.status(400).json({ success: false, message: "Invalid userBalance" });
    }

    // "<prefix>_<uid>_<suffix>"
    const memberAccount = `${agencyUid}_${userId}_${apiSuffix}`;

    // match provider fields (agency_uid = prefix, NOT api key)
    const requestPayload = {
      agency_uid: agencyUid,
      game_uid: gameCode,
      member_account: "hfb20f_" + 'sbm123' + "_1fac6d",
      timestamp: new Date().toISOString().replace(/\.\d{3}Z$/, "Z"),
      credit_amount: 100,
      currency_code: "INR", language: "en",
      platform: "2",
      home_url: window.location.protocol + "//" + window.location.host,
      transfer_id: `tx_${Date.now()}`,
    };

    const controller = new AbortController(); const timeout = setTimeout(() => controller.abort(), 12_000);

    let data: LaunchGameResponse | null = null;
    try {
      const response = await fetch(GAME_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          // IMPORTANT: send creds as headers
          "x-api-key": GAME_API_KEY,
          "x-api-suffix": apiSuffix,
        },
        body: JSON.stringify(requestPayload),
        signal: controller.signal,
      });

      const raw = await response.text();
      try {
        data = JSON.parse(raw) as LaunchGameResponse;
      } catch {
        return res.status(502).json({
          success: false,
          message: "Upstream returned non-JSON response",
          upstreamStatus: response.status,
          preview: raw.slice(0, 200),
        });
      }
    } finally {
      clearTimeout(timeout);
    }

    if (data?.code === 0 && data?.game_launch_url) {
      return res.json({ success: true, gameUrl: data.game_launch_url, memberAccount });
    }
    return res.status(400).json({ success: false, message: data, code: data?.code });
  } catch (error: any) {
    const msg = error?.name === "AbortError" ? "Request timeout" : error?.message || "Internal Server Error";
    console.error("❌ Game launch failed:", msg);
    return res.status(500).json({ success: false, message: msg });
  }
};


export const newlaunchGame = async (req: Request, res: Response) => {
  
  res.json({status: "success", message: "Game launched successfully",data: req.body});
  // try {
  //   const response = await fetch("https://24gameapi.org/api/gameLaunch.php", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify(req.body),
  //   });

  //   const data = await response.json();
  //   res.json(data);
  // } catch (err :any) {
  //   res.status(500).json({ error: "Server error", details: err.message });
  // }

}

