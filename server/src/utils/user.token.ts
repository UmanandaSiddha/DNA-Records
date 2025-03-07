import { CookieOptions, Response } from "express";
import { IUser } from "../models/user.model.js";

const sendToken = (user: IUser, statusCode: number, res: Response) => {
    const token = user.generateJWTToken();

    const options: CookieOptions = {
        expires: new Date(
            Date.now() + parseInt(process.env.COOKIE_EXPIRE as string) * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
    };

    res.status(statusCode)
        .cookie("user_token", token, options)
        .cookie("username", user.hiveUser, options)
        .json({
            success: true,
            user,
            token,
        });
};

export default sendToken;