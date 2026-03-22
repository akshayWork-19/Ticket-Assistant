import { inngest } from "../inngest/client.js";
import Ticket from "../models/ticket.model.js";
import { generateDraftReply } from "../utils/conversationAi.js";

export const createTicket = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required!" });
    }
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
          ticketId: (newTicket)._id.toString(),
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
    console.error("Error Creating Ticket");
    return res.status(500).json({ message: "Internal Error" + error.message });
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
        .sort({ createdAt: -1 });
    } else {
      tickets = await Ticket.find({ createdBy: user._id })
        .select("title description status createdAt responses")
        .sort({ createdAt: -1 });
    }
    // console.log(tickets);
    return res.status(200).json(tickets);
  } catch (error) {
    console.error("Error Fetching Tickets");
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
      res.status(404).json({ message: "Ticket Not Found!" });
    }

    return res.status(200).json({ message: "Ticket Fetched!", ticket });


  } catch (error) {
    console.error("Error Fetching Ticket");
    return res.status(500).json({ message: "Internal Error" + error.message })
  }
}


export const addResponse = async (req, res) => {
  const { id } = req.params;
  const { message } = req.body;
  try {
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
    const ticket = await Ticket.findById(id);
    const draft = await generateDraftReply(ticket.description, ticket.helpfulNotes);
    return res.status(200).json({
      draft
    })
  } catch (error) {
    return res.status(500).json({ error: "AI Draft Failed" });
  }
}

