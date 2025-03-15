import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";

export default async function BuyProduct(paymentLink: string) {
  const data = await prisma.payment.findUnique({
    where: {
      link: paymentLink,
    },
    select: {
      name: true,
      id: true,
      link: true,
      description: true,
      price: true,
      payload: true,
      images: true,
      business: {
        select: {
          name: true,
          stripeConnectedAccountId: true,
        },
      },
    },
  });

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "eur",
          unit_amount: Math.round((data?.price as number) * 100),
          product_data: {
            name: data?.name as string,
            description: data?.description,
            images: data?.images,
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      ...(data?.payload as any),
      id: data?.id,
      link: data?.link,
    },

    payment_intent_data: {
      application_fee_amount: Math.round((data?.price as number) * 100) * 0.02,
      transfer_data: {
        destination: data?.business?.stripeConnectedAccountId as string,
      },
    },
    success_url:
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000/payment/success"
        : "https://marshal-ui-yt.vercel.app/payment/success",
    cancel_url:
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000/payment/cancel"
        : "https://marshal-ui-yt.vercel.app/payment/cancel",
  });

  return redirect(session.url as string);
}