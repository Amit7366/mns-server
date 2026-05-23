import { UserBalance } from "../Transaction/userBalance.model";
import { SpinHistory } from "./spin.model";

const ALLOWED_AMOUNTS = [5, 7, 10, 15, 17, 22, 25] as const;

const addHours = (d: Date, h: number) => new Date(d.getTime() + h * 60 * 60 * 1000);

export class SpinService {
  static async getStatus(sbmId: string) {
    const now = new Date();

    const u = await UserBalance.findOne({ id: sbmId }).select(
      "id lastSpinAt nextSpinAt lastSpinAmount"
    );

    if (!u) {
      return {
        ok: false as const,
        code: 404 as const,
        message: "User balance not found",
      };
    }

    const nextSpinAt = u.nextSpinAt ?? null;
    const canSpin = !nextSpinAt || nextSpinAt <= now;

    return {
      ok: true as const,
      code: 200 as const,
      data: {
        id: sbmId,
        canSpin,
        lastSpinAt: u.lastSpinAt ?? null,
        nextSpinAt,
        lastSpinAmount: u.lastSpinAmount ?? 0,
        remainingMs: nextSpinAt ? Math.max(0, nextSpinAt.getTime() - now.getTime()) : 0,
      },
    };
  }

  static async claimSpin(opts: { sbmId: string; amount: number; ip?: string; ua?: string }) {
    const { sbmId, amount, ip, ua } = opts;

    if (!Number.isFinite(amount) || !ALLOWED_AMOUNTS.includes(amount as any)) {
      return { ok: false as const, code: 400 as const, message: "Invalid spinWinAmount" };
    }

    const now = new Date();
    const nextSpinAt = addHours(now, 24);

    /**
     * ✅ BEST PART:
     * One atomic update on UserBalance:
     * - only succeeds if cooldown passed
     * - increments balance + updates cooldown fields in same write
     */
    const updated = await UserBalance.findOneAndUpdate(
      {
        id: sbmId,
        $or: [
          { nextSpinAt: null },
          { nextSpinAt: { $exists: false } },
          { nextSpinAt: { $lte: now } },
        ],
      },
      [
        {
          $set: {
            // ✅ Safety: negative balance treated as 0, then add amount
            currentBalance: {
              $add: [{ $max: [{ $ifNull: ["$currentBalance", 0] }, 0] }, amount],
            },

            // ✅ Enable storeDbBalance increment too (like retention bonus)
            storeDbBalance: {
              $add: [{ $ifNull: ["$storeDbBalance", 0] }, amount],
            },

            // ✅ Keep your existing cooldown fields
            lastSpinAt: now,
            nextSpinAt,
            lastSpinAmount: amount,

            // ✅ replace $inc totalSpinWon with computed set (because pipeline update)
            totalSpinWon: {
              $add: [{ $ifNull: ["$totalSpinWon", 0] }, amount],
            },
          },
        },
      ],
      { new: true }
    ).select("id currentBalance storeDbBalance lastSpinAt nextSpinAt lastSpinAmount totalSpinWon");


    if (!updated) {
      // Either user not found OR already spun
      const existing = await UserBalance.findOne({ id: sbmId }).select("nextSpinAt lastSpinAt");

      if (!existing) {
        return { ok: false as const, code: 404 as const, message: "User balance not found" };
      }

      return {
        ok: false as const,
        code: 429 as const,
        message: "Already spun",
        data: {
          id: sbmId,
          lastSpinAt: existing.lastSpinAt ?? null,
          nextSpinAt: existing.nextSpinAt ?? null,
        },
      };
    }

    // ✅ Optional history (audit/admin) - non-blocking
    SpinHistory.create({
      sbmId,
      amount,
      claimedAt: now,
      nextSpinAt,
      ip: ip ?? null,
      ua: ua ?? null,
    }).catch(() => { });

    return {
      ok: true as const,
      code: 200 as const,
      message: "Spin claimed",
      data: {
        id: sbmId,
        winAmount: amount,
        currentBalance: updated.currentBalance,
        lastSpinAt: updated.lastSpinAt,
        nextSpinAt: updated.nextSpinAt,
        lastSpinAmount: updated.lastSpinAmount,
        totalSpinWon: updated.totalSpinWon,
      },
    };
  }
}
