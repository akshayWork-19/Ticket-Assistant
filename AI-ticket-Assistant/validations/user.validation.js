import { z } from "zod";

export const signupSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be 6 characters long!"),
    skills: z.array(z.string()).optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required")
  }),
});

export const updateUserSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address"),
    skills: z.array(z.string()).optional(),
    role: z.enum(["user", "moderator", "admin"]).optional()
  }),
});


export const updateProfileSchema = z.object({
  body: z.object({
    skills: z.array(z.string()).optional(),
    avatarUrl: z.string().url("Must be a valid URL!").optional().or(z.literal("")),
  }),
});