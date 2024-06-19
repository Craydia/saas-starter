import Image from "next/image";

import MaxWidthWrapper from "@/components/shared/max-width-wrapper";
import { Suspense } from "react"
import PlayButtonIFrame from "@/components/shared/play-button-iframe";

export default function PreviewLanding() {
  return (
    <div className="pb-6 sm:pb-16">
      <MaxWidthWrapper>
        <div className="rounded-xl md:bg-muted/30 md:p-3.5 md:ring-1 md:ring-inset md:ring-border">
          <div className="relative aspect-video overflow-hidden rounded-xl border md:rounded-lg">
            <Image
              className="size-full object-cover object-center"
              src="/images/blog/blog-post-3.jpg"
              alt="preview landing"
              width={2000}
              height={1000}
              priority={true}
            />
            <div className="absolute inset-0 z-10 flex items-center justify-center">
              <Suspense>
                <PlayButtonIFrame />
              </Suspense>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
}
