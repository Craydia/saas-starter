import { headers } from "next/headers"
import Stripe from "stripe"

import { env } from "@/env.mjs"
import { prisma } from "@/lib/db"
import { stripe } from "@/lib/stripe"
import { pricingData } from "@/config/subscriptions"

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get("Stripe-Signature") as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET
    )
  } catch (error: any) {
    return new Response(`Webhook Error: ${error.message}`, { status: 400 })
  }

  try{

    const session = event.data.object as Stripe.Checkout.Session

    if(session.mode === "subscription"){
      if (event.type === "checkout.session.completed") {
        // Retrieve the subscription details from Stripe.
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        )

        // Update the user stripe into in our database.
        // Since this is the initial subscription, we need to update
        // the subscription id and customer id.
        await prisma.user.update({
          where: {
            id: session?.metadata?.userId,
          },
          data: {
            stripeSubscriptionId: subscription.id,
            stripeCustomerId: subscription.customer as string,
            stripePriceId: subscription.items.data[0].price.id,
            stripeCurrentPeriodEnd: new Date(
              subscription.current_period_end * 1000
            ),
          },
        })
      }

      if (event.type === "invoice.payment_succeeded") {
        // Retrieve the subscription details from Stripe.
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        )

        // Update the price id and set the new period end.
        await prisma.user.update({
          where: {
            stripeSubscriptionId: subscription.id,
          },
          data: {
            stripePriceId: subscription.items.data[0].price.id,
            stripeCurrentPeriodEnd: new Date(
              subscription.current_period_end * 1000
            ),
          },
        })
      }
    }
    else {
      if (event.type === "checkout.session.completed") {

        const payment = await stripe.paymentIntents.retrieve(session.payment_intent as string);

        const ltdPlan = pricingData.find(p => p.prices.monthly === payment.amount / 100 || p.prices.yearly === payment.amount / 100)

        // Update the user stripe into in our database.
        // This is not a subscription but a LTD
        await prisma.user.update({
          where: {
            id: session?.metadata?.userId,
          },
          data: {
            stripeCustomerId: payment.customer as string,
            stripePriceId: ltdPlan?.stripeIds.monthly,
            stripeCurrentPeriodEnd: null,
            stripePaymentId: payment.id as string
          },
        })
      }
    }
  }
  catch(e: any){
    console.error(e);
    return new Response(JSON.stringify({error: "There was an error - " + JSON.stringify(e)}), { status: 500 })
  }

  return new Response(null, { status: 200 })
}
