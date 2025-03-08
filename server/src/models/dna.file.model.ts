import mongoose, { Schema, Document } from "mongoose";

export enum AccessLevel {
    PRIVATE = "PRIVATE",
    RESTRICTED = "RESTRICTED",
    PUBLIC = "PUBLIC",
}

export interface IDNAFile extends Document {
    owner: mongoose.Schema.Types.ObjectId;
    fileHash: string;
    originalFileName: string;
    storagePath: string;
    accessLevel: AccessLevel;
    allowedUsers: mongoose.Schema.Types.ObjectId[];
    price: number;
    createdAt: Date;
}

const DNAFileSchema: Schema<IDNAFile> = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        fileHash: {
            type: String,
            required: true,
            unique: true,
        },
        originalFileName: {
            type: String,
            required: true,
        },
        storagePath: {
            type: String,
            required: true,
        },
        accessLevel: {
            type: String,
            enum: Object.values(AccessLevel),
            default: AccessLevel.PRIVATE,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
            default: 0
        },
        allowedUsers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
    },
    { timestamps: true }
);

const DNAFile = mongoose.model<IDNAFile>("DNAFile", DNAFileSchema);
export default DNAFile;