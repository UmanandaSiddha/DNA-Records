import express from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { getDNAFile, grantAccessToUser, uploadDNAFile } from "../controllers/dns.controller.js";
import { isAuthenticatedUser } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.route("/upload").post(isAuthenticatedUser, upload.single("dnaFile"), uploadDNAFile);
router.post("/grant-access", grantAccessToUser);
router.get("/file/:fileId/:userId", getDNAFile);

export default router;
