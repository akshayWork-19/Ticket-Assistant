import express from 'express';
import { addResponse, createTicket, draftAiReply, getSingleTicket, getTickets } from '../controllers/ticket.js';
import { authenticate, authorizeRoles } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { createTicketSchema, addResponseSchema, getSingleTicketSchema } from '../validations/ticket.validation.js';

const router = express.Router();

// Validation happens right after authentication
router.post('/', authenticate, validate(createTicketSchema), createTicket);
router.get('/', authenticate, getTickets);

// We can even validate the URL params to ensure the ID is a valid MongoDB ObjectId
router.get('/:id', authenticate, validate(getSingleTicketSchema), getSingleTicket);

router.post('/:id/responses', authenticate, validate(addResponseSchema), addResponse);
router.post('/:id/draft', authenticate, authorizeRoles("admin", "moderator"), draftAiReply);

export default router;
