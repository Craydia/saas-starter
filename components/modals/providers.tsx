"use client";

import { createContext, Dispatch, ReactNode, SetStateAction } from "react";

import { useSignInModal } from "@/components/modals//sign-in-modal";
import { usePaywallModal } from "./paywall-modal";
import { useIFrameModal } from "./iframe-modal";

export const ModalContext = createContext<{
  setShowSignInModal: Dispatch<SetStateAction<boolean>>;
  setShowPaywallModal: Dispatch<SetStateAction<boolean>>;
  setShowIFrameModal: Dispatch<SetStateAction<boolean>>;
}>({
  setShowSignInModal: () => {},
  setShowPaywallModal: () => {},
  setShowIFrameModal: () => {}
});

export default function ModalProvider({ children }: { children: ReactNode }) {
  const { SignInModal, setShowSignInModal } = useSignInModal();
  const { PaywallModal, setShowPaywallModal } = usePaywallModal();
  const { IFrameModal, setShowIFrameModal } = useIFrameModal();

  return (
    <ModalContext.Provider
      value={{
        setShowSignInModal,
        setShowPaywallModal,
        setShowIFrameModal
      }}
    >
      <SignInModal />
      <PaywallModal />
      <IFrameModal />
      {children}
    </ModalContext.Provider>
  );
}
