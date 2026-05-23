import { UserBalance } from '../Transaction/userBalance.model';

const processedSerials = new Set<string>();

export async function getBalance(memberAccount: string) {
  const userBalance = await UserBalance.findOne({ id: memberAccount });
  if (!userBalance) {
    throw new Error(`User balance not found for account ${memberAccount}`);
  }

  console.log("🟢 DB BALANCE FOUND:", userBalance.currentBalance);
  return userBalance.currentBalance;
}

export async function updateWallet(
  serial: string,
  memberAccount: string,
  bet: number,
  win: number
) {
  console.log("➡️ WALLET UPDATE:", { serial, memberAccount, bet, win });

  if (processedSerials.has(serial)) {
    const balance = await getBalance(memberAccount);
    console.log("⚠️ DUPLICATE SERIAL — RETURNING BALANCE:", balance);
    return { balance, duplicate: true };
  }

  const userBalance = await UserBalance.findOne({ id: memberAccount });
  if (!userBalance) {
    throw new Error(`User balance not found for account ${memberAccount}`);
  }

  const newBalance = userBalance.currentBalance - bet + win;
  console.log("🧮 NEW BALANCE CALCULATED:", newBalance);

  userBalance.currentBalance = newBalance;
  await userBalance.save();

  processedSerials.add(serial);

  return { balance: newBalance, duplicate: false };
}
