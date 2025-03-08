import mongoose, { Schema, Document } from "mongoose";
import jwt from "jsonwebtoken";
import crypto from "crypto";

export const UserRoleEnum = {
    USER: "USER",
    ADMIN: "ADMIN",
    BUYER: "BUYER"
} as const;

export interface IUser extends Document {
    _id: mongoose.Schema.Types.ObjectId;
    firstName?: string;
    lastName?: string;
    email?: string;
    hiveUser: string;
    publicKey?: string;
    role: typeof UserRoleEnum[keyof typeof UserRoleEnum];
    isVerified: boolean;
    oneTimePassword?: string;
    oneTimeExpire?: Date;
    dnaFile?: mongoose.Schema.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;

    generateJWTToken(): string;
    getOneTimePassword(): string;
}

const UserSchema: Schema<IUser> = new mongoose.Schema(
    {
        firstName: String,
        lastName: String,
        email: String,
        hiveUser: {
            type: String,
            required: true,
            unique: true,
            index: true,
            match: /^[a-zA-Z0-9]+$/
        },
        publicKey: String,
        role: {
            type: String,
            enum: Object.values(UserRoleEnum),
            default: UserRoleEnum.USER,
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        oneTimePassword: String,
        oneTimeExpire: Date,
        dnaFile: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "DNAFile",
        },
    },
    {
        timestamps: true,
    }
);

UserSchema.methods.generateJWTToken = function (this: IUser) {
    const token = jwt.sign(
        { id: this._id },
        process.env.JWT_SECRET as string,
        { expiresIn: "7d" }
    );
    return token;
};

UserSchema.methods.getOneTimePassword = function (this: IUser) {
    const otp = Math.floor(100000 + Math.random() * 900000);

    this.oneTimePassword = crypto
        .createHash("sha256")
        .update(otp.toString())
        .digest("hex");

    this.oneTimeExpire = new Date(Date.now() + 15 * 60 * 1000);

    return otp.toString();
};


const User = mongoose.model<IUser>("User", UserSchema);
export default User;