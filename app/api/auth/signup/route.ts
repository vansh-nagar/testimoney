import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/libs/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json(); // delivers in part

  console.log(username, password);
  if (!username && !password) {
    NextResponse.json(
      {
        message: "please fill all inputs",
      },
      { status: 200 }
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
    NextResponse.json({
      message: "User creation failed. Please try again.",
    });
  }

  console.log(newUser);

  return NextResponse.json(
    { message: "Account created successfully. Welcome to our community!" },
    { status: 201 }
  );
}
