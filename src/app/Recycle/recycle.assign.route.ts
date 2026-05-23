// src/app/modules/recycle/recycle.assign.route.ts
import { Router } from "express";
import auth from "../middleware/auth";
import validateRequest from "../middleware/validateRequest";
import { RecycleAssignController } from "./recycle.assign.controller";
import {
  assignOfficerSchema,
  assignOfficerBulkSchema,
  assignedListQuerySchema,
} from "./recycle.assign.validate";
import { USER_ROLE } from "../User/user.constant";

const router = Router();

// ✅ Assign single (only admin/superAdmin)
router.patch(
  "/recycle/assign/:normalUserId",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(assignOfficerSchema),
  RecycleAssignController.assignOne
);

// ✅ Assign bulk
router.patch(
  "/recycle/assign-bulk",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(assignOfficerBulkSchema),
  RecycleAssignController.assignBulk
);

// ✅ Get assigned users by officer
router.get(
  "/recycle/assigned",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(assignedListQuerySchema),
  RecycleAssignController.assignedList
);

export const RecycleAssignRoutes = router;
