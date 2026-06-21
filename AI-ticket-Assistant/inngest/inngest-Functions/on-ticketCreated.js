import { inngest } from "../client.js";
import Ticket from "../../models/ticket.model.js"
import { NonRetriableError } from "inngest";
import analyzeTicket from "../../utils/conversationAi.js"
import User from "../../models/user.model.js";
import { sendMail } from "../../utils/mailer.js";
import logger from "../../utils/logger.js";

export const onTicketCreation = inngest.createFunction(
  {
    id: "on-ticket-created",
    retries: 2,
    onFailure: async ({ event, error }) => {
      const { ticketId } = event.data.event.data;
      await Ticket.findByIdAndUpdate(ticketId, {
        status: "TODO",
        processingError: "Automated processing failed. Manual review required."
      });
    }
  },
  { event: "ticket/create" },

  async ({ event, step }) => {
    const { ticketId } = event.data;
    logger.info(`🎫 Inngest: onTicketCreation triggered for: ${ticketId}`);

    //fetch ticket from DB
    const ticket = await step.run("fetch-ticket", async () => {
      logger.info("🔍 Fetching ticket details...");
      const ticketObject = await Ticket.findById(ticketId);
      if (!ticketObject) {
        logger.error(`❌ Ticket not found in DB: ${ticketId}`);
        throw new NonRetriableError("Ticket Not Found!");
      }
      return ticketObject.toObject();
    })

    await step.run("update-ticket-status", async () => {
      await Ticket.findByIdAndUpdate(ticket._id, { status: "TODO" });
    })

    const aiResponse = await step.run("call-ai-triage", async () => {
      try {
        return await analyzeTicket(ticket);
      } catch (error) {
        logger.error(`AI Triage Failed: ${error.message}`);
        return null;
      }
    });

    const relatedskills = await step.run("ai-processing", async () => {
      let skills = [];
      logger.info(`Inside ai-processing. aiResponse is: ${JSON.stringify(aiResponse)}`);
      if (aiResponse && typeof aiResponse === 'object') {
        const notes = aiResponse.helpful_notes || aiResponse.helpfulNotes;
        const helpfulNotesString = Array.isArray(notes) ? notes.join("\n") : (typeof notes === 'string' ? notes : "AI was unable to generate notes for this ticket.");

        await Ticket.findByIdAndUpdate(ticket._id, {
          priority: !["low", "medium", "high"].includes(aiResponse.priority?.toLowerCase())
            ? "medium"
            : aiResponse.priority.toLowerCase(),
          helpfulNotes: helpfulNotesString,
          status: "IN_PROGRESS",
          relatedSkills: Array.isArray(aiResponse.technical_skills) ? aiResponse.technical_skills : (Array.isArray(aiResponse.relatedSkills) ? aiResponse.relatedSkills : []),
        }, {
          new: true
        });
        skills = Array.isArray(aiResponse.technical_skills) ? aiResponse.technical_skills : (Array.isArray(aiResponse.relatedSkills) ? aiResponse.relatedSkills : []);
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
          skills: { $in: relatedskills }
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
        logger.debug(`Final Ticket State: ${JSON.stringify(finalTicket)}`);
        if (moderator?.email) {
          await sendMail(
            moderator.email,
            "Ticket Assigned",
            `A new ticket is assigned to you ${finalTicket.title}`
          );
        } else {
          logger.warn("Assigned moderator has no email, skipping notification");
        }
      }
    });

    return { success: true };
  }
);
