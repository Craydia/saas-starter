import { redirect } from "next/navigation";

import { BillingInfo } from "@/components/billing-info";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";
import { Icons } from "@/components/shared/icons";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getCurrentUser } from "@/lib/session";
import { getUserSubscriptionPlan } from "@/lib/subscription";
import { constructMetadata } from "@/lib/utils";
import { useUser } from "@/hooks/use-user";

export const metadata = constructMetadata({
  title: "Billing – SaaS Starter",
  description: "Manage billing and your subscription plan.",
});

export default async function BillingPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const userSubscriptionPlan = await getUserSubscriptionPlan(user.id);

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Billing"
        text="Manage billing and your subscription plan."
      />
      <div className="grid gap-8">
        <BillingInfo userSubscriptionPlan={userSubscriptionPlan} />
      </div>
    </DashboardShell>
  );
}
