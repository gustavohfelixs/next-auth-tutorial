import { getVerificationTokenByEmail } from "@/data/verification-token";
import { findPasswordResetTokenByEmail } from "@/data/password-reset-token";
import { findTwoFactorTokenByEmail } from "@/data/two-factor-token";

import { db } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import crypt from "crypto";

export const generateTwoFactorToken = async (email: string) => {
  const token = crypt.randomInt(100_000, 1_000_000).toString();
  // TODO: Later change to 15 minutes
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const exisistingToken = await findTwoFactorTokenByEmail(email);

  if (exisistingToken) {
    db.twoFactorToken.delete({ where: { id: exisistingToken.id } });
  }

  const twoFactorToken = await db.twoFactorToken.create({
    data: { email, token, expires },
  });

  return twoFactorToken;
};

export const generateVerificationToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getVerificationTokenByEmail(email);

  console.log("Sim tem token " + JSON.stringify(existingToken) + email);
  if (existingToken) {
    await db.verificationToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const verificationToken = await db.verificationToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return verificationToken;
};

export const generatePasswordResetVerificationToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await findPasswordResetTokenByEmail(email);

  if (existingToken) {
    await db.passwordResetToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const passwordResetToken = await db.passwordResetToken.create({
    data: { email, token, expires },
  });

  return passwordResetToken;
};
