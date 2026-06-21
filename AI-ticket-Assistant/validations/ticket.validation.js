import { z } from "zod";


export const createTicketSchema = z.object({
    body: z.object({
        title: z.string().min(3, "Title must be 3 characters long!"),
        description: z.string().min(1, "Description is required!"),
    }),
});

export const addResponseSchema = z.object({
    params: z.object({
        id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ticket ID"),
    }),
    body: z.object({
        message: z.string().min(1, "Message cannot be empty!")
    }),
});


export const getSingleTicketSchema = z.object({
    params: z.object({
        id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ticket ID"),
    }),
});
