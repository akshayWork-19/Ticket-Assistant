import { inngest } from "../inngest/client.js";
import Ticket from "../models/ticket.model.js";
import { generateDraftReply } from "../utils/conversationAi.js";
import mongoose from "mongoose";

export const createTicket = async (req, res) => {
  try {
    const title = req.body.title?.trim();
    const description = req.body.description?.trim();
    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required!" });
    }
    if (title.length < 3) return res.status(409).json({
      message: "Title too short"
    });
    const newTicket = await Ticket.create({
      title,
      description,
      createdBy: req.user._id.toString()
    })

    // console.log(newTicket);
    try {
      await inngest.send({
        name: "ticket/create",
        data: {
          ticketId: newTicket._id.toString(),
          title,
          description,
          createdBy: req.user._id.toString()
        }
      });
    } catch (error) {
      console.log(error.message);
    }


    return res.status(201).json({
      message: "Ticket created and processing started!",
      ticket: newTicket
    });

  } catch (error) {
    console.error("Error Creating Ticket:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export const getTickets = async (req, res) => {
  try {
    // console.log(req);
    const user = req.user;
    // console.log(user);
    let tickets = [];
    if (user.role !== "user") {
      tickets = await Ticket.find({})
        .populate("assignedTo", ["email", "_id"])
        .sort({ createdAt: -1 })
        .limit(50);
    } else {
      tickets = await Ticket.find({ createdBy: user._id })
        .select("title description status createdAt responses")
        .sort({ createdAt: -1 });
    }
    // console.log(tickets);
    return res.status(200).json(tickets);
  } catch (error) {
    console.error("Error Fetching Tickets", error.message);
    return res.status(500).json({ message: "Internal Error " + error.message })
  }
}

export const getSingleTicket = async (req, res) => {
  try {
    const user = req.user;
    let ticket;
    if (user.role !== "user") {
      ticket = await Ticket.findById(req.params.id)
        .populate("assignedTo", ["email", "_id"]);
    } else {
      ticket = await Ticket.findOne({
        createdBy: user._id,
        _id: req.params.id
      })
        .select("title description status createdAt priority helpfulNotes relatedSkills assignedTo responses")
        .populate("assignedTo", ["email", "_id"]); // Add population for 'assignedTo'
    }

    if (!ticket) {
      return res.status(404).json({ message: "Ticket Not Found!" });
    }

    return res.status(200).json({ message: "Ticket Fetched!", ticket });

  } catch (error) {
    console.error("Error Fetching Ticket", error.message);
    return res.status(500).json({ message: "Internal Error" + error.message })
  }
}


export const addResponse = async (req, res) => {
  const { id } = req.params;
  const { message } = req.body;
  if (!req.user?._id || !req.user?.role) {
    return res.status(401).json({ error: "Invalid user session." });
  }
  if (!message || !message.trim()) {
    return res.status(400).json({ error: "Message cannot be empty!" });
  }
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ticket ID." });
    }
    const ticket = await Ticket.findById(id);
    if (!ticket) {
      return res.status(404).json({
        error: "Ticket Not Found!"
      })
    }
    ticket.responses.push({
      senderId: req.user._id,
      senderRole: req.user.role,
      message
    })

    if (req.user.role === "user") ticket.status = "TODO";
    else ticket.status = "IN_PROGRESS";
    await ticket.save();

    return res.status(200).json({
      success: true,
      ticket
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to add response!"
    })
  }
}

export const draftAiReply = async (req, res) => {
  const { id } = req.params;
  try {
    if (mongoose.Types.ObjectId.isValid(id)) {
      return res.status(401).json({ error: "Invalid ticket Id " })
    }
    const ticket = await Ticket.findById(id);
    if (!ticket) return res.status(404).json({ error: "Ticket not found!" });

    const aiNotes = ticket.helpfulNotes || "No additional context provided";

    const draft = await generateDraftReply(ticket.description, ticket.helpfulNotes);
    return res.status(200).json({
      draft
    })
  } catch (error) {
    return res.status(500).json({ error: "AI Draft Failed" });
  }
}

