import express from 'express';
import { createTicket, getSingleTicket, getTickets } from '../controllers/ticket.js';
import { authenticate } from '../middlewares/auth.js';


const router = express.Router();

router.post('/', authenticate, createTicket);
router.get('/', authenticate, getTickets);
router.get('/:id', authenticate, getSingleTicket);

export default router;