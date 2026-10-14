import { z } from "zod";

export const contactSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(80, "Name cannot exceed 80 characters"),
  email: z
    .string()
    .email("Please provide a valid email address"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message cannot exceed 2000 characters"),
  honeypot: z.string().optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;

export const projectSchema = z.object({
  title: z
    .string()
    .min(2, "Title must be at least 2 characters")
    .max(120, "Title cannot exceed 120 characters"),
  category: z
    .string()
    .min(2, "Category must be at least 2 characters")
    .max(80, "Category cannot exceed 80 characters"),
  description: z
    .string()
    .max(1000, "Description cannot exceed 1000 characters")
    .optional()
    .nullable(),
  link: z
    .string()
    .url("Link must be a valid URL")
    .or(z.literal(""))
    .optional()
    .nullable(),
  imageUrl: z
    .string()
    .min(1, "Cover image is required"),
  gallery: z.string().optional().nullable(),
  pdfUrl: z.string().optional().nullable(),
  order: z.coerce.number().int().default(0),
  published: z.boolean().default(true),
});

export type ProjectFormData = z.infer<typeof projectSchema>;

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
