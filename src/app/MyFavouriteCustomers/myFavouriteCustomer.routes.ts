import { Router, Request, Response, NextFunction } from "express";
import auth from "../middleware/auth";
import validateRequest from "../middleware/validateRequest";
import { USER_ROLE } from "../User/user.constant";

import { MyFavouriteCustomerController } from "./myFavouriteCustomer.controller";
import {
  createFavouriteCustomerSchema,
  getFavouriteCustomerByAdminSchema,
} from "./myFavouriteCustomer.validate";

const router = Router();

// ✅ validate query helper (keep it if validateRequest doesn't validate req.query)
const validateQuery =
  (schema: typeof getFavouriteCustomerByAdminSchema) =>
  (req: Request, _res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse({ query: req.query });
      req.query = parsed.query as any;
      return next();
    } catch (err) {
      return next(err);
    }
  };

// ✅ POST: add favourite customer
router.post(
  "/",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(createFavouriteCustomerSchema),
  MyFavouriteCustomerController.create
);

// ✅ GET: favourites list by adminId (query param adminId=A-0001)
router.get(
  "/",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateQuery(getFavouriteCustomerByAdminSchema),
  MyFavouriteCustomerController.getByAdmin
);

export const MyFavouriteCustomerRoutes = router;
