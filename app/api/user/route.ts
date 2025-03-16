import { createBusiness, getBusinessBySecretCode } from "@/lib/business";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { getUserSubscriptionPlan } from "@/lib/subscription";
import { middlewareChain } from "@/middleware/handler";
import { authUser } from "@/middleware/user";
import { NextResponse } from "next/server";

const putHandler = async(req: Request) => {
  const user = await getCurrentUser();
  const body = await req.json()

  if(user.businessId){
    return NextResponse.json({data: "ok"}, {status: 200})
  }

  let business = await getBusinessBySecretCode(body.secretCode);

  if(!business) {
    business = await createBusiness();
  }
  else{
    // const businessTier = await getUserSubscriptionPlan(business.Users[0].id);
    // if(business.Users.length + 1 > (businessTier?.dataLimitations?.seats ?? 1)){
    //   return NextResponse.json({error: "tier-block", message: "Tier limit has been reach for users in this company"}, {status: 401});
    // }
  }

  await prisma.user.update({
    where: {
      id: user.id
    },
    data: {
      businessId: business.id
    }
  })

  return NextResponse.json({data: "ok"}, {status: 200})
}

export const PUT = middlewareChain(authUser, putHandler)