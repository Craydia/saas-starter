import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import {middlewareChain} from "@/middleware/handler";

const handler = async (req: Request) => {
  try {
    const user = await req.json();
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(user.password, 5);

    // Create the user in the database
    const createdUser = await prisma.user.create({
      data: {
        ...user,
        password: hashedPassword,
        emailVerified: undefined,
        id: undefined,
        provider: "credentials",
        type: user.email?.includes("gmail") ? "gmail" : "email-custom"
      }
    });

    // Return a successful response with the created user data
    return NextResponse.json({
      status: 'success',
      message: 'User created successfully',
      user: {
        id: createdUser.id,
        email: createdUser.email,
        name: createdUser.name,
        // Exclude the password from the response
      }
    }, {
      status: 200
    });

  } catch (error) {
    console.error("Error creating user:", error);

    // Return an error response
    return NextResponse.json({
      status: 'error',
      message: 'Failed to create user',
      error: 'Server error'
    }, {
      status: 500
    });
  }
};

export const POST = middlewareChain(handler)