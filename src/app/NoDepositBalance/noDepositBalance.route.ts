import { Router } from "express";
import auth from "../middleware/auth";
import validateRequest from "../middleware/validateRequest";
import { NoDepositBalanceController } from "./noDepositBalance.controller";
import { assignBulkSchema, assignSchema, assignedQuerySchema } from "./noDepositBalance.validate";
import { USER_ROLE } from "../User/user.constant";

const router = Router();

router.get(
  "/",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  NoDepositBalanceController.list
);

router.get(
  "/assigned",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(assignedQuerySchema),
  NoDepositBalanceController.assigned
);

router.patch(
  "/assign/:userId",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(assignSchema),
  NoDepositBalanceController.assignOne
);

router.patch(
  "/assign-bulk",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(assignBulkSchema),
  NoDepositBalanceController.assignBulk
);

export const NoDepositBalanceRoutes = router;
