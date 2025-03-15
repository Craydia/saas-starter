import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";

export async function GetStripeDashboardLink() {
  const session = await auth();

  if (!session?.user || !session?.user.email) {
    throw new Error();
  }

  const data = await prisma.user.findUnique({
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

  const loginLink = await stripe.accounts.createLoginLink(
    data?.business?.stripeConnectedAccountId as string
  );

  return redirect(loginLink.url);
}