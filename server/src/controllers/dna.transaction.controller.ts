import { Request, Response } from "express";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import DNARequest from "../models/dna.request.model.js";
import User from "../models/user.model.js";
import DNAFile from "../models/dna.file.model.js";
import Notification from "../models/notification.model.js";

export const createDNARequest = catchAsyncErrors(async (req: Request, res: Response) => {
    const { buyerId, requestedCount, pricePerDNA } = req.body;

    const buyer = await User.findById(buyerId);
    if (!buyer) {
        return res.status(404).json({ message: "Buyer not found" });
    }

    const matchedSellers = await DNAFile.find({
        saleStatus: "FOR_SALE",
        price: { $lte: pricePerDNA },
    }).populate("owner");

    if (matchedSellers.length === 0) {
        return res.status(404).json({ message: "No sellers match your criteria" });
    }

    const dnaRequest = await DNARequest.create({
        buyer: buyer._id,
        requestedCount,
        pricePerDNA,
        matchedSellers: matchedSellers.map((dna) => dna.owner),
    });

    for (const seller of matchedSellers) {
        await Notification.create({
            recipient: seller.owner,
            type: "DNA_REQUEST",
            message: `A buyer is requesting ${requestedCount} DNA at ${pricePerDNA} DNACOIN each.`,
            dnaRequestId: dnaRequest._id,
        });
    }

    res.status(201).json({ message: "Request created, sellers notified.", dnaRequest });
});

export const processDNARequest = catchAsyncErrors(async (req: Request, res: Response) => {
    const { requestId, sellerUsername, buyerUsername } = req.body;

    const dnaRequest = await DNARequest.findById(requestId);
    if (!dnaRequest || dnaRequest.status !== "PENDING") {
        return res.status(400).json({ message: "Invalid or completed request" });
    }

    const seller = await User.findOne({ hiveUser: sellerUsername });
    const buyer = await User.findOne({ hiveUser: buyerUsername });

    if (!seller || !buyer) {
        return res.status(404).json({ message: "Seller or buyer not found" });
    }

    await DNAFile.updateMany(
        { owner: seller._id },
        { $addToSet: { allowedUsers: buyer._id } }
    );

    dnaRequest.status = "FULFILLED";
    await dnaRequest.save();

    res.status(200).json({ message: "DNA request accepted, buyer granted access" });
});
