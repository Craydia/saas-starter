// @ts-nocheck
// TODO: Fix this when we turn strict mode on.
import { pricingData } from "@/config/subscriptions";
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { UserSubscriptionPlan } from "@/types";

export async function getUserSubscriptionPlan(
  userId: string
): Promise<UserSubscriptionPlan> {
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
    select: {
      stripeSubscriptionId: true,
      stripeCurrentPeriodEnd: true,
      stripeCustomerId: true,
      stripePriceId: true,
      stripePaymentId: true
    },
  })

  if (!user) {
    throw new Error("User not found")
  }

  const pricing = pricingData.find(p => p.stripeIds.monthly === user.stripePriceId || p.stripeIds.yearly === user.stripePriceId);

  // Check if user is on a paid plan.
  let isPaid =
    user.stripePriceId &&
    (user.stripeCurrentPeriodEnd?.getTime() + 86_400_000 > Date.now() || pricing?.ltd) ? true : false;

  // Find the pricing data corresponding to the user's plan
  const userPlan =
    pricingData.find((plan) => plan.stripeIds.monthly === user.stripePriceId) ||
    pricingData.find((plan) => plan.stripeIds.yearly === user.stripePriceId);

  const plan = isPaid && userPlan ? userPlan : {title: "Free"}

  const interval = isPaid
    ? userPlan?.stripeIds.monthly === user.stripePriceId
      ? "month"
      : userPlan?.stripeIds.yearly === user.stripePriceId
      ? "year"
      : null
    : null;

  let isCanceled = false;
  if (isPaid && user.stripeSubscriptionId) {
    const stripePlan = await stripe.subscriptions.retrieve(
      user.stripeSubscriptionId
    )
    isCanceled = stripePlan.cancel_at_period_end
  }
  else if(isPaid && user.stripePaymentId) {
    const stripePlan = await stripe.paymentIntents.retrieve(
      user.stripePaymentId
    )
    isCanceled = stripePlan.status === "canceled";
    isPaid = !isCanceled;
  }

  return {
    ...plan,
    ...user,
    stripeCurrentPeriodEnd: user.stripeCurrentPeriodEnd?.getTime(),
    isPaid,
    interval,
    isCanceled
  }
}
