import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/libs/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const singUpSchema = z.object({
  username: z.string().min(3, "username at least be 3 characters"),
  password: z.string().min(6, "password at least be 6 characters"),
});

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json(); // delivers in part

    const parsed = singUpSchema.safeParse({ username, password });

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: " Invalid input ",
          errors: parsed.error.format(),
        },
        { status: 400 }
      );
    }

    if (!username?.trim() || !password.trim()) {
      return NextResponse.json(
        {
          message: "please fill all inputs",
        },
        { status: 400 }
      );
    }

    const searchedUser = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (searchedUser) {
      return NextResponse.json(
        {
          message:
            "This username is already registered. Please sign in or choose a different username.",
        },
        { status: 400 }
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(password, salt);

    const newUser = await prisma.user.create({
      data: {
        username,
        password: hashPass,
      },
    });

    if (!newUser) {
      return NextResponse.json(
        {
          message: "User creation failed. Please try again.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Account created successfully. Welcome to our community!" },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error) {
      console.log("sign up error :", error.message);
    }

    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}
