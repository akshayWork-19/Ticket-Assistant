import { inngest } from "../client.js";
import Ticket from "../../models/ticket.model.js"
import { NonRetriableError } from "inngest";
import analyzeTicket from "../../utils/conversationAi.js"
import User from "../../models/user.model.js";
import { sendMail } from "../../utils/mailer.js";


export const onTicketCreation = inngest.createFunction(
  { id: "on-ticket-created", retries: 2 },
  { event: "ticket/create" },

  async ({ event, step }) => {
    const { ticketId } = event.data;
    // console.log("ticketId:", ticketId);
    //fetch ticket from DB
    const ticket = await step.run("fetch-ticket", async () => {
      const ticketObject = await Ticket.findById(ticketId);
      // console.log("ticketObject:", ticketObject);
      if (!ticketObject) {
        throw new NonRetriableError("Ticket Not Found!");
      }
      return ticketObject;
    })

    await step.run("update-ticket-status", async () => {
      // console.log("Running");
      await Ticket.findByIdAndUpdate(ticket._id, { status: "TODO" });
    })

    // const aiResponse = await analyzeTicket(ticket);

    const aiResponse = await step.run("call-ai-triage", async () => {
      try {
        return await analyzeTicket(ticket);
      } catch (error) {
        console.error("AI Triage Failed:", error.message);
        return null;
      }
    });

    const relatedskills = await step.run("ai-processing", async () => {
      let skills = [];
      if (aiResponse && typeof aiResponse === 'object') {
        await Ticket.findByIdAndUpdate(ticket._id, {
          priority: !["low", "medium", "high"].includes(aiResponse.priority?.toLowerCase())
            ? "medium"
            : aiResponse.priority.toLowerCase(),
          helpfulNotes: aiResponse.helpfulNotes || "AI was unable to generate notes for this ticket.",
          status: "IN_PROGRESS",
          relatedSkills: Array.isArray(aiResponse.relatedSkills) ? aiResponse.relatedSkills : [],
        }, {
          new: true
        });
        skills = Array.isArray(aiResponse.relatedSkills) ? aiResponse.relatedSkills : [];
      } else {
        // Fallback if AI fails completely
        await Ticket.findByIdAndUpdate(ticket._id, {
          priority: "medium",
          helpfulNotes: "Automated triage failed. Manual review required.",
          status: "TODO"
        });
      }
      return skills;
    });


    const moderator = await step.run("assign-moderator", async () => {
      const skillsToMatch = Array.isArray(relatedskills) && relatedskills.length > 0 
        ? relatedskills.join("|") 
        : "general";

      let user = await User.findOne({
        role: "moderator",
        skills: {
          $elemMatch: {
            $regex: skillsToMatch,
            $options: "i",
          },
        },
      });
      if (!user) {
        user = await User.findOne({
          role: "admin",
        });
      }
      await Ticket.findByIdAndUpdate(ticket._id, {
        assignedTo: user?._id || null,
      });
      return user;
    });

    await step.run("send-email-notification", async () => {
      if (moderator) {
        const finalTicket = await Ticket.findById(ticket._id);
        console.log(finalTicket);
        await sendMail(
          moderator.email,
          "Ticket Assigned",
          `A new ticket is assigned to you ${finalTicket.title}`
        );
      }
    });
    return { success: true };

  }
)