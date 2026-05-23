// src/app/modules/recycle/recycle.route.ts

import { Router } from "express";

import { RecycleController } from "./recycle.controller";
import { USER_ROLE } from "../User/user.constant";
import auth from "../middleware/auth";
import validateRequest from "../middleware/validateRequest";
import { giveRecycleBonusSchema } from "./recycle.validate";
import { RecycleBonusController } from "./recycle.bonus.controller";

const router = Router();

/**
 * GET /recycle
 * query: ?days=3&page=1&limit=20&search=sbm
 * ✅ Rule A applied in pipeline (customerOfficerId null)
 */
router.get(
  "/",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  RecycleController.list
);
router.post(
  "/retention/bonus",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(giveRecycleBonusSchema),
  RecycleBonusController.give
);

export const RecycleRoutes = router;
