import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";

import { Modal } from "@/components/ui/modal";

function IFrameModal({
  showIFrameModal,
  setShowIFrameModal,
}: {
  showIFrameModal: boolean;
  setShowIFrameModal: Dispatch<SetStateAction<boolean>>;
}) {

  return (
    <Modal showModal={showIFrameModal} setShowModal={setShowIFrameModal} className="h-3/4 !w-4/5 !max-w-none bg-transparent">
      <iframe
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        title="Introducing Limitless: a personalized AI powered by what you’ve seen, said, or heard"
        width="100%"
        height="100%"
        src="https://www.loom.com/embed/eb99582dfda0411989b773eb89faa07e?sid=8b4efbbe-9ebb-4a33-b5c6-4180d0f5995e"
        id="widget8"
        data-gtm-yt-inspected-9="true"
      ></iframe>
    </Modal>
  );
}

export function useIFrameModal() {
  const [showIFrameModal, setShowIFrameModal] = useState(false);

  const IFrameModalCallback = useCallback(() => {
    return (
      <IFrameModal
        showIFrameModal={showIFrameModal}
        setShowIFrameModal={setShowIFrameModal}
      />
    );
  }, [showIFrameModal, setShowIFrameModal]);

  return useMemo(
    () => ({
      setShowIFrameModal,
      IFrameModal: IFrameModalCallback,
    }),
    [setShowIFrameModal, IFrameModalCallback],
  );
}
