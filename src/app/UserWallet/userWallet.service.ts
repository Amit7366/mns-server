// src/UserWallet/userWallet.service.ts

import { UserWallet } from "./userWallet.model";


export const createUserWallet = async (payload: any) => {
  if (payload.isDefault) {
    // unset any existing default wallets for the user
    await UserWallet.updateMany(
      { userId: payload.userId },
      { isDefault: false }
    );
  }

  return await UserWallet.create(payload);
};

export const getUserWallets = async (userId: string) => {
  return await UserWallet.find({ userId }).sort({ createdAt: -1 });
};

export const getUserWalletById = async (id: string) => {
  return await UserWallet.findById(id);
};

export const updateUserWallet = async (id: string, payload: any) => {
  const updated = await UserWallet.findByIdAndUpdate(id, payload, { new: true });

  // if setting as default, update others
  if (payload.isDefault && updated) {
    await UserWallet.updateMany(
      { userId: updated.userId, _id: { $ne: updated._id } },
      { isDefault: false }
    );
  }

  return updated;
};

export const deleteUserWallet = async (id: string) => {
  return await UserWallet.findByIdAndDelete(id);
};
