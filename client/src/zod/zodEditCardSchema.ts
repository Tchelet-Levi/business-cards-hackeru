import { z } from "zod";

const zodEditCardSchema = z.object({
  businessName: z.optional(
    z
      .string()
      .min(3, { message: "Business name must be at least 3 characters long." })
      .max(256, { message: "Business name cannot be more than 256 characters long." })
  ),
  businessDescription: z.optional(
    z
      .string()
      .min(3, { message: "Business description must be at least 3 characters long." })
      .max(1000, { message: "Business description cannot be more than 1000 characters long." })
  ),
  businessAddress: z.optional(
    z
      .string()
      .min(3, { message: "Address must be at least 3 characters long." })
      .max(256, { message: "Address cannot be more than 256 characters long." })
  ),
  businessPhone: z.optional(
    z
      .string()
      .min(4, { message: "Phone number must be at least 4 characters long." })
      .max(12, { message: "Phone number cannot be more than 12 characters long." })
  ),
  businessImage: z.optional(z.string().min(3).max(512)),
});

export type ZodEditCardSchema = z.infer<typeof zodEditCardSchema>;
export default zodEditCardSchema;
