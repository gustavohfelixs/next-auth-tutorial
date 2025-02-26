"use server";

import { RegisterSchema } from "@/schemas";
import * as z from "zod";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);

  console.log("Chegou os valores " + validatedFields.data?.password);

  if (!validatedFields.success) {
    return { error: "Invalid Fields!" };
  }

  return { success: "Register Successefully!" };
};
