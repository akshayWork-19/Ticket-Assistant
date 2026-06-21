import * as ticketService from "../services/ticket.service.js";
import logger from "../utils/logger.js";

export const createTicket = async (req, res) => {
  try {
    const title = req.body.title?.trim();
    const description = req.body.description?.trim();

    // Zod validation usually catches this, but keeping it as a safety net
    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required!" });
    }
    if (title.length < 3) return res.status(409).json({ message: "Title too short" });

    const newTicket = await ticketService.createTicket(req.user._id.toString(), { title, description });

    return res.status(201).json({
      message: "Ticket created and processing started!",
      ticket: newTicket
    });
  } catch (error) {
    logger.error(`Error Creating Ticket: ${error.message}`, { stack: error.stack });
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getTickets = async (req, res) => {
  try {
    const tickets = await ticketService.getTicketsForUser(req.user);
    return res.status(200).json(tickets);
  } catch (error) {
    logger.error(`Error Fetching Tickets: ${error.message}`, { stack: error.stack });
    return res.status(500).json({ message: "Internal Error " + error.message });
  }
};

export const getSingleTicket = async (req, res) => {
  try {
    const ticket = await ticketService.getSingleTicket(req.user, req.params.id);
    return res.status(200).json({ message: "Ticket Fetched!", ticket });
  } catch (error) {
    if (error.message === "Ticket Not Found!") {
      return res.status(404).json({ message: error.message });
    }
    logger.error(`Error Fetching Ticket: ${error.message}`, { stack: error.stack });
    return res.status(500).json({ message: "Internal Error " + error.message });
  }
};

export const addResponse = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;

    if (!req.user?._id || !req.user?.role) {
      return res.status(401).json({ error: "Invalid user session." });
    }

    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Message cannot be empty!" });
    }

    const ticket = await ticketService.addResponseToTicket(id, req.user._id, req.user.role, message);

    return res.status(200).json({
      success: true,
      ticket
    });
  } catch (error) {
    if (error.message === "Invalid ticket ID." || error.message === "Ticket Not Found!") {
      return res.status(error.message === "Ticket Not Found!" ? 404 : 400).json({ error: error.message });
    }
    return res.status(500).json({ error: "Failed to add response!" });
  }
};

export const draftAiReply = async (req, res) => {
  try {
    const { id } = req.params;
    const draft = await ticketService.generateAiDraft(id);

    return res.status(200).json({ draft });
  } catch (error) {
    if (error.message === "Invalid ticket ID." || error.message === "Ticket Not Found!") {
      return res.status(error.message === "Ticket Not Found!" ? 404 : 400).json({ error: error.message });
    }
    return res.status(500).json({ error: "AI Draft Failed" });
  }
};
