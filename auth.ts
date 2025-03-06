import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";

import { findUserById } from "./data/user";

import { db } from "./lib/db";
import { User, UserRole } from "@prisma/client";
import { findTwoFactorConfirmationByUserId } from "./data/two-factor-confirmation";

export const { auth, handlers, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: {
          emailVerified: new Date(),
        },
      });
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") {
        return true;
      }

      const existingUser = await findUserById(user.id);

      // Prevent sign in withou email verification
      if (!existingUser?.emailVerified) return false;

      // TODO: Add 2FA check

      if (existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await findTwoFactorConfirmationByUserId(
          user.id
        );

        console.log({ twoFactorConfirmation });

        if (!twoFactorConfirmation) return false;

        // Delete two factor confirmaton for next sign in
        await db.twoFactorConfirmation.delete({
          where: {
            id: twoFactorConfirmation.id,
          },
        });
      }

      return true;
    },
    async session({ token, session }) {
      console.log({ sessionToken: token });
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }
      if (session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
      }

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await findUserById(token.sub);

      if (!existingUser) return token;

      token.role = existingUser.role;
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled as boolean;

      return token;
    },
  },
  ...authConfig,
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
});
