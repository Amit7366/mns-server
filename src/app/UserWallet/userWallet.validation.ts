// src/UserWallet/userWallet.validation.ts
import { z } from 'zod';

export const createUserWalletValidation = z.object({
  body: z.object({
    userId: z.string({ required_error: 'User ID is required' }),
    walletType: z.enum(['ewallet', 'bank'], {
      required_error: 'Wallet type must be either ewallet or bank',
    }),
    walletName: z.string({ required_error: 'Wallet name is required' }),
    accountHolderName: z.string({ required_error: 'Account holder name is required' }),
    walletNumber: z
      .string({ required_error: 'Wallet number is required' })
      .min(6, 'Wallet number must be at least 6 characters'),
    isDefault: z.boolean().optional(),
  }),
});

export const updateUserWalletValidation = z.object({
  body: z.object({
    walletType: z.enum(['ewallet', 'bank']).optional(),
    walletName: z.string().optional(),
    accountHolderName: z.string().optional(),
    walletNumber: z.string().optional(),
    isDefault: z.boolean().optional(),
  }),
});
