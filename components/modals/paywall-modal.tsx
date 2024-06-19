import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";

import { Icons } from "@/components/shared/icons";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { siteConfig } from "@/config/site";
import { UserAuthForm } from "../forms/user-auth-form";
import { pricingData } from "@/config/subscriptions";
import Image from "next/image"
import PricingCard from "@/components/pricing-card";

function PaywallModal({
  showPaywallModal,
  setShowPaywallModal,
}: {
  showPaywallModal: boolean;
  setShowPaywallModal: Dispatch<SetStateAction<boolean>>;
}) {

  return (
    <Modal showModal={showPaywallModal} setShowModal={setShowPaywallModal}>
      <div className="flex flex-col items-center justify-center">
        <Image alt="logo" src="/mstile-150x150.png" height={100} width={100}/>
        <h3 className="font-urban text-2xl font-bold">Upgrade to unlock more features!</h3>
        <p className="font-urban">Join now under the PRO plan and never look back!</p>
      </div>
      <div className="p-4">
        <PricingCard paywall offer={pricingData[1]}/>
      </div>
    </Modal>
  );
}

export function usePaywallModal() {
  const [showPaywallModal, setShowPaywallModal] = useState(false);

  const PaywallModalCallback = useCallback(() => {
    return (
      <PaywallModal
        showPaywallModal={showPaywallModal}
        setShowPaywallModal={setShowPaywallModal}
      />
    );
  }, [showPaywallModal, setShowPaywallModal]);

  return useMemo(
    () => ({
      setShowPaywallModal,
      PaywallModal: PaywallModalCallback,
    }),
    [setShowPaywallModal, PaywallModalCallback],
  );
}
