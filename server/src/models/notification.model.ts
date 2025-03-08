import mongoose, { Schema } from "mongoose";

export enum NotificationType {
    DNA_REQUEST = "DNA_REQUEST",
    ACCEPTED_REQUEST = "ACCEPTED_REQUEST",
}

export interface INotification extends Document {
    _id: mongoose.Schema.Types.ObjectId;
    recipient: mongoose.Schema.Types.ObjectId;
    type: "DNA_REQUEST" | "ACCEPTED_REQUEST";
    message: string;
    dnaRequestId?: mongoose.Schema.Types.ObjectId;
    isRead?: boolean;
    createdAt: Date;
}

const NotificationSchema: Schema<INotification> = new mongoose.Schema(
    {
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        type: {
            type: String,
            enum: Object.values(NotificationType),
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        dnaRequestId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "DNARequest",
        },
        isRead: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

const Notification = mongoose.model<INotification>("Notification", NotificationSchema);
export default Notification;