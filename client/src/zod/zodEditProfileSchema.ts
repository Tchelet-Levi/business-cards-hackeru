import { z } from "zod";

const zodEditProfileSchema = z.object({
  avatar: z.optional(z.string()),
  fullName: z
    .string()
    .min(4, { message: "Your full name must be at least 4 characters long." })
    .max(256, {
      message:
        "Your full name cannot be more than 256 characters long, and if it is then we are genuinely impressed and sorry at the same time.",
    }),
  password: z.optional(
    z
      .string()
      .min(4, { message: "The password must be at least 4 characters long." })
      .max(128, { message: "The password cannot be more than 128 characters long" })
  ),
  email: z
    .string()
    .email({ message: "The email is invalid." })
    .min(6, { message: "The email must be at least 6 characters long." })
    .max(256, { message: "The email cannot be more than 256 characters long." }),
});

export type ZodEditProfileSchema = z.infer<typeof zodEditProfileSchema>;
export default zodEditProfileSchema;
