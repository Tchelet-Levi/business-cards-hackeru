import { z } from "zod";

const zodSignUpSchema = z.object({
  email: z
    .string()
    .email({ message: "The email is invalid." })
    .min(6, { message: "The email must be at least 6 characters long." })
    .max(256, { message: "The email cannot be more than 256 characters long." }),
  password: z
    .string()
    .min(4, { message: "The password must be at least 4 characters long." })
    .max(128, { message: "The password cannot be more than 128 characters long" }),
  fullName: z
    .string()
    .min(4, { message: "Your full name must be at least 4 characters long." })
    .max(256, {
      message:
        "Your full name cannot be more than 256 characters long, and if it is then we are genuinely impressed and sorry at the same time.",
    }),
  isBusinessAccount: z.boolean(),
});

export type ZodSignUpSchemaType = z.infer<typeof zodSignUpSchema>;
export default zodSignUpSchema;
