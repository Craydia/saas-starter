import { getCurrentUser } from "@/lib/session";
import { getUserSubscriptionPlan } from "@/lib/subscription";
import { differenceInDays, sub } from "date-fns";
import { NextApiResponse } from "next";
import { NextResponse } from "next/server";

const TRIAL_DAYS = 7;
const ADMINS = ['leo@craydia.com'];

export const authUser = async(req: any, res: NextApiResponse, next: () => void) => {
  const user = await getCurrentUser();

  if(user) next()
  else{
    return NextResponse.json({
      error: "unathenticated"
    }, {
      status: 401
    }); 
  }
}

export const authPayingUser = async(req: any, res: NextApiResponse, next: () => void) => {
  const user = await getCurrentUser();
  const sub = await getUserSubscriptionPlan(user.id);

  if(!user) return NextResponse.json({
    error: "tier-block"
  }, {
    status: 401
  });

  const daysSinceCreation = differenceInDays(new Date(), new Date(user?.createdAt ?? ''));
  const isInTrial = daysSinceCreation < TRIAL_DAYS;

  if(sub.isPaid || isInTrial || ADMINS.includes(user.email)) next()
  else{
    return NextResponse.json({
      error: "tier-block"
    }, {
      status: 401
    }); 
  }
}