"use server";

import * as z from "zod";

import { db } from "@/lib/db";
import { SettingsSchemas } from "@/schemas";
import { findUserById } from "@/data/user";
import { currentUser } from "@/lib/auth";

export const settings = async (values: z.infer<typeof SettingsSchemas>) => {
  const user = await currentUser();

  if (!user) return { error: "Unauthorized!" };

  const dbUser = await findUserById(user.id);

  if (!dbUser) return { error: "Unauthorized!" };

  await db.user.update({
    where: {
      id: dbUser.id,
    },
    data: {
      ...values,
    },
  });

  return { success: "Settings updated!" };
};
