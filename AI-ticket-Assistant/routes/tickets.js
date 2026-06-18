import express from 'express';
import { addResponse, createTicket, draftAiReply, getSingleTicket, getTickets } from '../controllers/ticket.js';
import { authenticate, authorizeRoles } from '../middlewares/auth.js';


const router = express.Router();

router.post('/', authenticate, createTicket);
router.get('/', authenticate, getTickets);
router.get('/:id', authenticate, getSingleTicket);
router.post('/:id/responses', authenticate, addResponse);
router.post('/:id/draft', authenticate, authorizeRoles("admin", "moderator"), draftAiReply);

export default router;