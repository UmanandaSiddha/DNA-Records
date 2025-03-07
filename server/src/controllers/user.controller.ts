import { NextFunction, Request, Response } from "express";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import User, { UserRoleEnum } from "../models/user.model.js";
import sendToken from "../utils/user.token.js";
import { UserRequest } from "../middlewares/auth.middleware.js";
import ErrorHandler from "../utils/errorHandler.js";
import { StatusCodes } from "http-status-codes";
import sendMail from "../utils/send.mail.js";
import crypto from "crypto";

export const signInUser = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { hiveUser, hivePublicKey } = req.body;

    let user = await User.findOne({ hiveUser });
    if (!user) {
        user = await User.create({
            hiveUser,
            publicKey: hivePublicKey,
        })
    }

    sendToken(user, StatusCodes.CREATED, res);
});

export const requestVerification = catchAsyncErrors(async (req: UserRequest, res: Response, next: NextFunction): Promise<void> => {
    const { user } = req;
    if (!user) return next(new ErrorHandler("User not found", 404));
    if (user.isVerified) return next(new ErrorHandler("User is already verified", 400));

    const otp = user.getOneTimePassword();
    await user.save({ validateBeforeSave: false });

    try {
        const options = {
            templateId: "EMAIL_OTP_VERIFICATION",
            recieverEmail: user.email!,
            dynamicData: {
                otp: otp,
            }
        }
        await sendMail(options);

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`,
        });
    } catch (error: any) {
        user.oneTimePassword = undefined;
        user.oneTimeExpire = undefined;
        await user.save({ validateBeforeSave: false });

        return next(new ErrorHandler(error.message, 500));
    }
});

export const verifyUser = catchAsyncErrors(async (req: UserRequest, res: Response, next: NextFunction): Promise<void> => {
    const { otp } = req.body;
    if (!otp) return next(new ErrorHandler("Please enter OTP", 400));
    const { user } = req;
    if (!user) return next(new ErrorHandler("User not found", 404));

    const oneTimePassword = crypto
        .createHash("sha256")
        .update(otp.toString())
        .digest("hex");

    const otpUser = await User.findOne({
        _id: user._id,
        oneTimePassword,
        oneTimeExpire: { $gt: Date.now() },
    });
    if (!otpUser) return next(new ErrorHandler("Email Veification OTP has Expired", 400));

    otpUser.isVerified = true;
    otpUser.oneTimePassword = undefined;
    otpUser.oneTimeExpire = undefined;
    await otpUser.save();

    // try {
    //     const options = {
    //         templateId: EMAIL_ACCOUNT_CREATED,
    //         recieverEmail: otpUser.profile.email,
    //         dynamicData: {
    //             name: `${otpUser.profile.firstName} ${otpUser.profile.lastName}`,
    //         }
    //     }
    //     await sendMail(options);
    // } catch (error: any) {
    //     console.log(error.message);
    // }

    sendToken(otpUser, 200, res);
});

export const completeProfile = catchAsyncErrors(async (req: UserRequest, res: Response, next: NextFunction): Promise<void> => {
    const { user } = req;
    if (!user) return next(new ErrorHandler("User not found", StatusCodes.NOT_FOUND));

    const { firstName, lastName, email } = req.body;

    const newUser = await user.updateOne(
        {
            firstName,
            lastName,
            email,
            role: email === process.env.ADMIN_EMAIL ? UserRoleEnum.ADMIN : UserRoleEnum.USER,
        }
    )

    res.status(StatusCodes.OK).json({
        success: true,
        message: "Profile updated successfully",
        user: newUser,
    })
});

export const logoutUser = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    res.clearCookie("user_token").clearCookie("username");

    res.status(200).json({
        success: true,
        message: "Logged Out Successfully",
    });
});

export const getUserDetails = catchAsyncErrors(async (req: UserRequest, res: Response, next: NextFunction): Promise<void> => {
    const { user } = req;
    if (!user) return next(new ErrorHandler("User not found", StatusCodes.NOT_FOUND));

    res.status(200).json({
        success: true,
        user,
    });
});