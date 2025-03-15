import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";

export async function CreateStripeAccoutnLink() {
  const session = await auth()

  if (!session?.user || !session?.user.email) {
    throw new Error();
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      business: {
        select: {
          stripeConnectedAccountId: true,
        },
      },
    },
  });

  const accountLink = await stripe.accountLinks.create({
    account: user?.business?.stripeConnectedAccountId as string,
    refresh_url:
      process.env.NODE_ENV === "development"
        ? `http://localhost:3000/billing`
        : `https://marshal-ui-yt.vercel.app/billing`,
    return_url:
      process.env.NODE_ENV === "development"
        ? `http://localhost:3000/return/${user?.business?.stripeConnectedAccountId}`
        : `https://marshal-ui-yt.vercel.app/return/${user?.business?.stripeConnectedAccountId}`,
    type: "account_onboarding",
  });

  return redirect(accountLink.url);
}