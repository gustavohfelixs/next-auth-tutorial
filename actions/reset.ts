"use server";

import * as z from "zod";

import { ResetSchema } from "@/schemas";
import { findUserByEmail } from "@/data/user";
import { generatePasswordResetVerificationToken } from "@/lib/tokens";
import { sendPasswordResetEmail } from "@/lib/mail";

export const reset = async (values: z.infer<typeof ResetSchema>) => {
  const validatedFields = ResetSchema.safeParse(values);

  if (!validatedFields.success) return { error: "Invalid email!" };

  const { email } = validatedFields.data;

  const exisistingUser = await findUserByEmail(email);

  if (!exisistingUser) return { error: "Email not found! " };

  const passwordResetToken = await generatePasswordResetVerificationToken(
    email
  );

  await sendPasswordResetEmail(
    passwordResetToken.email,
    passwordResetToken.token
  );

  return { success: "Reset email sent!" };
};
