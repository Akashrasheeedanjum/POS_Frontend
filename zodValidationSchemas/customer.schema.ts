// schemas/supplier.schema.ts
import { z } from "zod";

export const customerCreateSchema = z.object({
    vatNumber: z.string().trim().optional(),
    nameDenomination: z.string({ required_error: "Customer name is required" }).trim().min(2, "Customer name must be at least 2 characters"),
    // email: z.string({ required_error: "Email is required" }).trim().email("Invalid email format"),
    // firstName: z.string({ required_error: "First Name is required" }).trim().min(2, "First Name must be at least 3 characters"),
      // EOID: z.string().trim().min(9, "EOID Name must be at least 9 digit string"),
      //  FID: z.string().trim().min(9, "FID Name must be at least 9 digit string"),
    billingAddress: z.object({
    address: z
      .string({ required_error: "Billing Address is required" })
      .trim()
      .min(2, "Billing Address must be at least 2 characters"),
  }),
   usePriceList1: z.boolean().optional(),
    usePriceList2: z.boolean().optional(),
    usePriceList3: z.boolean().optional(),
    usePriceList4: z.boolean().optional(),
}).refine(
    (data) =>
      data.usePriceList1 || data.usePriceList2 || data.usePriceList3 || data.usePriceList4,
    {
      message: "Please select at least one Use Price List option",
      path: ["usePriceList"], // error show hoga ye key pe
    }
  );

export const customerUpdateSchema = z.object({
    vatNumber: z.string().trim().optional(),
    nameDenomination: z.string({ required_error: "Customer name is required" }).trim().min(2, "Customer name must be at least 2 characters"),
    // email: z.string({ required_error: "Email is required" }).trim().email("Invalid email format"),
    // firstName: z.string({ required_error: "First Name is required" }).trim().min(2, "First Name must be at least 3 characters"),
    billingAddress: z.object({
    address: z
      .string({ required_error: "Billing Address is required" })
      .trim()
      .min(2, "Billing Address must be at least 2 characters"),
  }),
});
