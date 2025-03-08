import express from "express";
import { authorizeRoles, isAuthenticatedUser } from "../middlewares/auth.middleware.js";
import { buyerAccess } from "../controllers/admin.controller.js";
import { UserRoleEnum } from "../models/user.model.js";

const router = express.Router();

router.route("/buyer-access").put(isAuthenticatedUser, authorizeRoles(UserRoleEnum.ADMIN), buyerAccess);

export default router;