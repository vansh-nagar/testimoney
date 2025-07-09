import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import { PrismaClient } from "@prisma/client";

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
  ],
};

const handler = NextAuth(authOptions);

export const GET = handler;
export const POST = handler;
