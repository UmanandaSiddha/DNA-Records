import express from "express";
import { getUserDetails, signInUser } from "../controllers/user.controller.js";
import { isAuthenticatedUser } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.route("/sign-in").post(signInUser);
router.route("/me").get(isAuthenticatedUser, getUserDetails);

export default router;