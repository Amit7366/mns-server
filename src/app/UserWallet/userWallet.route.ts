// src/UserWallet/userWallet.route.ts

import express from 'express';
import * as WalletController from './userWallet.controller';
import validateRequest from '../middleware/validateRequest';
import auth from '../middleware/auth';
import { USER_ROLE } from '../User/user.constant';
import { createUserWalletValidation, updateUserWalletValidation } from './userWallet.validation';


const router = express.Router();

// ✅ Create wallet (User only)
router.post(
  '/',
  auth(USER_ROLE.user),
  validateRequest(createUserWalletValidation),
  WalletController.createWalletHandler
);

// ✅ Get all wallets for a user
router.get(
  '/user/:userId',
  auth(USER_ROLE.user),
  WalletController.getUserWalletsHandler
);

// ✅ Get one wallet by ID
router.get(
  '/:id',
  auth(USER_ROLE.user),
  WalletController.getWalletByIdHandler
);

// ✅ Update wallet
router.patch(
  '/:id',
  auth(USER_ROLE.user),
  validateRequest(updateUserWalletValidation),
  WalletController.updateWalletHandler
);

// ✅ Delete wallet
router.delete(
  '/:id',
  auth(USER_ROLE.user),
  WalletController.deleteWalletHandler
);

export const UserWalletRoutes = router;
