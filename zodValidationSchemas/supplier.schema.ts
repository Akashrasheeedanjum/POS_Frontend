// schemas/supplier.schema.ts
import { z } from "zod";

export const supplierCreateSchema = z.object({
    nameDenomination: z.string({ required_error: "Name - Dénomination is required" }).trim().min(2, "Name - Dénomination must be at least 2 characters"),
    email: z.string().trim().email("Invalid email format").optional(),
});

export const supplierUpdateSchema = z.object({
    nameDenomination: z.string().trim().min(2, "Name - Dénomination must be at least 2 characters"),
    email: z.string().trim().email("Invalid email format").optional().or(z.literal("")),
});
