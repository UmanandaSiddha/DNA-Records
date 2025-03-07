import express from "express";
import { signInUser } from "../controllers/user.controller.js";

const router = express.Router();

router.route("/sign-in").post(signInUser);

export default router;