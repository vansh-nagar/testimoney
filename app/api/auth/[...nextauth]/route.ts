import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import bcrypt from "bcryptjs";

import { PrismaClient } from "@prisma/client";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

const prisma = new PrismaClient();

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "username" },
        password: {
          label: "Password",
          type: "password",
          placeholder: "password",
        },
      },

      async authorize(credentials, req) {
        if (!credentials) {
          return null;
        }
        const { username, password } = credentials;

        const searchedUser = await prisma.user.findUnique({
          where: {
            username: username,
          },
        });

        if (searchedUser) {
          console.log("old user found comparing passwords 😊");

          if (!searchedUser.password) {
            console.log("password does not exist 😭");
            return null;
          }

          const result = await bcrypt.compare(password, searchedUser?.password);

          if (!result) {
            console.log("incorrect password 😭");
            return null;
          }

          return {
            // need to return id to
            id: searchedUser.id,
            username,
          };
        }

        console.log("user not found create user 😭");
        return null;
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_ID ?? "",
      clientSecret: process.env.GOOGLE_SECRET ?? "",
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
    }),
  ],
  session: {
    strategy: "jwt",
  },
  adapter: PrismaAdapter(prisma),
};

const handler = NextAuth(authOptions);

export const GET = handler;
export const POST = handler;
