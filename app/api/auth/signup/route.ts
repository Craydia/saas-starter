import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import {middlewareChain} from "@/middleware/handler";
import { createBusiness } from "@/lib/business";

const handler = async (req: Request) => {
  try {
    const user = await req.json();
    const businessSecretCode = user?.businessSecretCode;

    delete user.businessSecretCode;

    let business: any;
    if(businessSecretCode){
      business = await prisma.business.findUnique({
        where: {
          secretCode: businessSecretCode
        },
        include: {users: true}
      });

      // const businessTier = await getUserSubscriptionPlan(business.users[0].id);
      // if(business.users.length + 1 > (businessTier?.dataLimitations?.seats ?? 1)){
      //   return NextResponse.json({error: "tier-block", message: "Tier limit has been reach for users in this company"}, {status: 401});
      // }
    }
    else {
      business = await createBusiness();
    }
    
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
        type: user.email?.includes("gmail") ? "gmail" : "email-custom",
        businessId: business.id,
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