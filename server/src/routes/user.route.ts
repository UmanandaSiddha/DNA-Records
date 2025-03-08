import express from "express";
import { completeProfile, getUserDetails, signInUser } from "../controllers/user.controller.js";
import { isAuthenticatedUser } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.route("/sign-in").post(signInUser);
router.route("/me").get(isAuthenticatedUser, getUserDetails);
router.route("/update-profile").put(isAuthenticatedUser, completeProfile);

export default router;