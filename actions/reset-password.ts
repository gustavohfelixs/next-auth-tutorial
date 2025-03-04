"use server";

import { findUserByEmail } from "@/data/user";
import { getVerificationTokenByToken } from "@/data/verification-token";
import { db } from "@/lib/db";
import { sendPasswordResetEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/tokens";
import { NewPasswordSchema, ResetSchema } from "@/schemas";
import { User } from "@prisma/client";
import bcrypt from "bcryptjs";
import * as z from "zod";

export const verifyToken = async (token: string) => {
  const existingToken = await getVerificationTokenByToken(token);

  if (!existingToken) {
    return { error: "Token does not exists!" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) return { error: "Token has expired" };

  const existingUser = await findUserByEmail(existingToken.email);

  if (!existingUser) return { error: "Email does not exists!" };

  return { existingUser };
};

export const resetPassword = async (
  user: User,
  token: string,
  values: z.infer<typeof NewPasswordSchema>
) => {
  try {
    const validatedFields = NewPasswordSchema.safeParse(values);

    const verificationToken = await getVerificationTokenByToken(token);

    const newPassword = validatedFields.data?.newPassword;

    if (!verificationToken) return { error: "Token does not exists" };

    if (!newPassword) return { error: "New Password is required" };

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.user.update({
      data: { password: hashedPassword },
      where: {
        id: user.id,
      },
    });
    await db.verificationToken.delete({
      where: { id: verificationToken.id },
    });

    return { success: "Password Reset successfuly" };
  } catch (e) {
    return { error: "Something went wrong" };
  }
};

export const sendResetPasswordEmail = async (
  values: z.infer<typeof ResetSchema>
) => {
  console.log("CHegou aqui");
  const validatedFields = ResetSchema.safeParse(values);

  const email = validatedFields.data?.email;

  if (!email) return { error: "Email is required" };

  if (!validatedFields.success) {
    return { error: "Invalid Fields!" };
  }
  const existingUser = await findUserByEmail(email);

  if (!existingUser) return { error: "Email does not exists" };

  const verificationToken = await generateVerificationToken(email);

  await sendPasswordResetEmail(
    verificationToken.email,
    verificationToken.token
  );

  return { success: "Confirmation email sent!" };
};
