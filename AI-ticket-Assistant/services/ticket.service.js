// services/ticket.service.js
import { inngest } from "../inngest/client.js";
import Ticket from "../models/ticket.model.js";
import { generateDraftReply } from "../utils/conversationAi.js";
import mongoose from "mongoose";
import logger from "../utils/logger.js";

export const createTicket = async (userId, { title, description }) => {
    const newTicket = await Ticket.create({
        title,
        description,
        createdBy: userId,
    });

    try {
        await inngest.send({
            name: "ticket/create",
            data: {
                ticketId: newTicket._id.toString(),
                title,
                description,
                createdBy: userId,
            },
        });
    } catch (error) {
        logger.error(`Inngest ticket/create error: ${error.message}`);
    }

    return newTicket;
};

export const getTicketsForUser = async (user, { page = 1, limit = 10 } = {}) => {
    const skip = (page - 1) * limit;

    if (user.role !== "user") {
        const [tickets, total] = await Promise.all([
            Ticket.find({ isDeleted: { $ne: true } })
                .populate("assignedTo", ["email", "_id"])
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Ticket.countDocuments({ isDeleted: { $ne: true } })
        ]);
        return { tickets, total, page, limit, totalPages: Math.ceil(total / limit) };
    } else {
        const [tickets, total] = await Promise.all([
            Ticket.find({ createdBy: user._id, isDeleted: { $ne: true } })
                .select("title description status createdAt responses")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Ticket.countDocuments({ createdBy: user._id, isDeleted: { $ne: true } })
        ]);
        return { tickets, total, page, limit, totalPages: Math.ceil(total / limit) };
    }
};

export const getSingleTicket = async (user, ticketId) => {
    let ticket;
    if (user.role !== "user") {
        ticket = await Ticket.findOne({ _id: ticketId, isDeleted: { $ne: true } })
            .populate("assignedTo", ["email", "_id"]);
    } else {
        ticket = await Ticket.findOne({
            createdBy: user._id,
            _id: ticketId,
            isDeleted: { $ne: true }
        })
            .select("title description status createdAt priority helpfulNotes relatedSkills assignedTo responses")
            .populate("assignedTo", ["email", "_id"]);
    }

    if (!ticket) {
        throw new Error("Ticket Not Found!");
    }
    return ticket;
};

export const addResponseToTicket = async (ticketId, userId, userRole, message) => {
    if (!mongoose.Types.ObjectId.isValid(ticketId)) {
        throw new Error("Invalid ticket ID.");
    }

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
        throw new Error("Ticket Not Found!");
    }

    ticket.responses.push({
        senderId: userId,
        senderRole: userRole,
        message,
    });

    if (userRole === "user") {
        ticket.status = "TODO";
    } else {
        ticket.status = "IN_PROGRESS";
    }

    await ticket.save();
    return ticket;
};

export const generateAiDraft = async (ticketId) => {
    if (!mongoose.Types.ObjectId.isValid(ticketId)) {
        throw new Error("Invalid ticket ID.");
    }

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
        throw new Error("Ticket Not Found!");
    }

    const draft = await generateDraftReply(ticket.description, ticket.helpfulNotes);
    return draft;
};

export const deleteTicket = async (ticketId, userId, userRole) => {
    const ticket = await Ticket.findById(ticketId);
    if (!ticket || ticket.isDeleted) {
        throw new Error("Ticket Not Found!");
    }

    if (userRole === "user" && ticket.createdBy.toString() !== userId.toString()) {
        throw new Error("Unauthorized to delete this ticket");
    }

    ticket.isDeleted = true;
    await ticket.save();
    return true;
};
