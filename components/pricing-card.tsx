import { cn } from "@/lib/utils";
import { SubscriptionPlan, UserSubscriptionPlan } from "@/types";
import { Link } from "lucide-react";
import { BillingFormButton } from "./forms/billing-form-button";
import { Icons } from "./shared/icons";
import { Button, buttonVariants } from "./ui/button";
import { useState, useContext } from "react";
import { ModalContext } from "./modals/providers";

interface Props {
  userId?: string;
  subscriptionPlan?: UserSubscriptionPlan;
  offer: SubscriptionPlan
  paywall?: boolean
  isYearly?: boolean
}

const PricingCard = ({ userId, subscriptionPlan, offer, paywall, isYearly: isYearlyProps }: Props) => {
  const isYearlyDefault =
    !subscriptionPlan?.stripeCustomerId || subscriptionPlan.interval === "year"
      ? true
      : false;
  const isYearly = isYearlyProps ?? isYearlyDefault;
  const { setShowSignInModal } = useContext(ModalContext);
  
  return (
    <div
      className={cn(
        "relative flex flex-col overflow-hidden rounded-3xl border shadow-sm",
        offer.title.toLocaleLowerCase() === "pro" && subscriptionPlan
          ? "-m-0.5 border-2 border-purple-400"
          : "",
      )}
      key={offer.title}
    >
      <div className="min-h-[150px] items-start space-y-4 bg-muted/50 p-6">
        <p className="flex font-urban text-sm font-bold uppercase tracking-wider text-muted-foreground">
          {offer.title}
        </p>

        <div className="flex flex-row">
          <div className="flex items-end">
            <div className="flex text-left text-3xl font-semibold leading-6">
              {isYearly && !offer.ltd && offer.prices.monthly > 0 ? (
                <>
                  <span className="mr-2 text-muted-foreground/80 line-through">
                    ${offer.prices.monthly}
                  </span>
                  <span>${offer.prices.yearly / 12}</span>
                </>
              ) : (
                `$${offer.prices.monthly}`
              )}
            </div>
            <div className="-mb-1 ml-2 text-left text-sm font-medium text-muted-foreground">
              <div>{offer.ltd ? 'One Time Payment' : '/month'}</div>
            </div>
          </div>
        </div>
        {offer.prices.monthly > 0 ? (
          <div className="text-left text-sm text-muted-foreground">
            {isYearly && !offer.ltd
              ? `$${offer.prices.yearly} will be charged when annual`
              : offer.ltd ? 'Life Time Access' : "when charged monthly"}
          </div>
        ) : null}
      </div>

      <div className="flex h-full flex-col justify-between gap-16 p-6">
        <ul className="space-y-2 text-left text-sm font-medium leading-normal">
          {offer.benefits.map((feature) => (
            <li className="flex items-start gap-x-3" key={feature}>
              <Icons.check className="size-5 shrink-0 text-purple-500" />
              <p>{feature}</p>
            </li>
          ))}

          {offer.limitations.length > 0 &&
            offer.limitations.map((feature) => (
              <li
                className="flex items-start text-muted-foreground"
                key={feature}
              >
                <Icons.close className="mr-3 size-5 shrink-0" />
                <p>{feature}</p>
              </li>
            ))}
        </ul>

        {((userId && subscriptionPlan) || paywall) ? (
          offer.title === "Starter" ? (
            <Link
              href="/dashboard"
              className={cn(
                buttonVariants({
                  variant: "outline",
                  rounded: "full",
                }),
                "w-full",
              )}
            >
              Go to dashboard
            </Link>
          ) : (
            <BillingFormButton
              year={isYearly}
              offer={offer}
              subscriptionPlan={subscriptionPlan}
            />
          )
        ) : (
          <Button
            variant={
              offer.title.toLocaleLowerCase() === "pro"
                ? "default"
                : "outline"
            }
            rounded="full"
            onClick={() => setShowSignInModal(true)}
          >
            Sign in
          </Button>
        )}
      </div>
    </div>
  );
};

export default PricingCard;