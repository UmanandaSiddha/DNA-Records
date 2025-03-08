import { NextFunction, Request, Response } from "express";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../utils/errorHandler.js";
import { StatusCodes } from "http-status-codes";
import User, { UserRoleEnum } from "../models/user.model.js";

export const buyerAccess = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) return next(new ErrorHandler("User not found", StatusCodes.NOT_FOUND));

    if (user.role === UserRoleEnum.BUYER) {
        return next(new ErrorHandler("Already a buyer", StatusCodes.BAD_REQUEST));
    }

    const newUser = await user.updateOne(
        { role: UserRoleEnum.BUYER }
    )

    res.status(StatusCodes.OK).json({
        success: true,
        message: "Profile updated successfully",
        user: newUser,
    })
});