import { NextFunction, Request, Response } from "express";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import { UserRequest } from "../middlewares/auth.middleware.js";
import ErrorHandler from "../utils/errorHandler.js";
import { StatusCodes } from "http-status-codes";
import crypto from "crypto";
import DNAFile, { AccessLevel } from "../models/dna.file.model.js";
import { promises as fsPromises } from "fs";
import User from "../models/user.model.js";

export const uploadDNAFile = catchAsyncErrors(async (req: UserRequest, res: Response, next: NextFunction) => {
    const { user } = req;
    if (!user) return next(new ErrorHandler("User not found", StatusCodes.NOT_FOUND));

    if (!req.file) {
        return next(new ErrorHandler("No file uploaded", StatusCodes.BAD_REQUEST));
    }

    const filePath = `./public/uploads/${req.file.filename}`;
    
    const fileBuffer = await fsPromises.readFile(filePath);

    const fileHash = crypto.createHash("sha256").update(fileBuffer).digest("hex");

    const existingFile = await DNAFile.findOne({ fileHash });
    if (existingFile) {
        return res.status(StatusCodes.CONFLICT).json({ 
            success: false, 
            message: "File already exists", 
            existingFile 
        });
    }

    const dnaFile = await DNAFile.create({
        owner: user._id,
        fileHash,
        originalFileName: req.file?.originalname,
        storagePath: filePath,
        accessLevel: req.body.accessLevel || AccessLevel.PRIVATE,
        allowedUsers: [],
    });

    const newUser = await User.findByIdAndUpdate(
        user._id,
        { dnaFile: dnaFile._id },
        { new: true, runValidators: true, useFindAndModify: false }
    )

    res.status(StatusCodes.CREATED).json({ success: true, message: "DNA file uploaded successfully", dnaFile, user: newUser });
});

export const grantAccessToUser = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    const { fileId, userId } = req.body;
    const dnaFile = await DNAFile.findById(fileId);

    const user = await User.findById(userId);
    if (!user) return next(new ErrorHandler("User not found", StatusCodes.NOT_FOUND));

    if (!dnaFile) {
        return next(new ErrorHandler("DNA file not found", StatusCodes.NOT_FOUND));
    }

    if (dnaFile.accessLevel !== AccessLevel.RESTRICTED) {
        return next(new ErrorHandler("This file does not require access approval.", StatusCodes.BAD_REQUEST));
    }

    dnaFile.allowedUsers.push(user._id);
    await dnaFile.save();

    res.status(StatusCodes.OK).json({ message: "Access granted successfully", dnaFile });
});

export const getDNAFile = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    const { fileId, userId } = req.params;
    const dnaFile = await DNAFile.findById(fileId);

    const user = await User.findById(userId);
    if (!user) return next(new ErrorHandler("User not found", StatusCodes.NOT_FOUND));

    if (!dnaFile) {
        return next(new ErrorHandler("DNA file not found", StatusCodes.NOT_FOUND));
    }

    if (
        dnaFile.accessLevel === AccessLevel.PRIVATE &&
        dnaFile.owner.toString() !== user._id.toString()
    ) {
        return res.status(403).json({ message: "Access Denied" });
    }

    if (
        dnaFile.accessLevel === AccessLevel.RESTRICTED &&
        !dnaFile.allowedUsers.includes(user._id)
    ) {
        return res.status(403).json({ message: "Access Denied" });
    }

    res.sendFile(dnaFile.storagePath);
});