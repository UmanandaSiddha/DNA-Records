import mongoose, { Schema, Document } from "mongoose";

export interface IDNARequest extends Document {
    _id: mongoose.Schema.Types.ObjectId;
    buyer: mongoose.Schema.Types.ObjectId;
    requestedCount: number;
    pricePerDNA: number;
    matchedSellers: mongoose.Schema.Types.ObjectId[];
    status: "PENDING" | "FULFILLED" | "CANCELLED";
    createdAt: Date;
}

const DNARequestSchema: Schema<IDNARequest> = new mongoose.Schema(
    {
        buyer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        requestedCount: {
            type: Number,
            required: true,
        },
        pricePerDNA: {
            type: Number,
            required: true,
        },
        matchedSellers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        status: {
            type: String,
            enum: ["PENDING", "FULFILLED", "CANCELLED"],
            default: "PENDING",
        },
    },
    { timestamps: true }
);

const DNARequest = mongoose.model<IDNARequest>("DNARequest", DNARequestSchema);
export default DNARequest;
