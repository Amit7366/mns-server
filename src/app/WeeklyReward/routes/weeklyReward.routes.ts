// weeklyReward.route.ts

import express from 'express';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../../User/user.constant';
import {
  claimWeeklyReward,
  getWeeklyRewardsAdmin,
  getUserWeeklyReward,
} from '../controllers/weeklyReward.controller';

const router = express.Router();

// ✅ User claims their weekly cashback
router.post('/weekly-reward/claim', auth(USER_ROLE.user), claimWeeklyReward);

// ✅ Admin fetches all users' weekly cashback
router.get(
  '/admin/weekly-rewards',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  getWeeklyRewardsAdmin
);

// ✅ User fetches their own reward details (before claiming)
router.get(
  '/weekly-reward/my-reward',
  auth(USER_ROLE.user),
  getUserWeeklyReward
);

export const WeeklyRewardRoutes = router;
