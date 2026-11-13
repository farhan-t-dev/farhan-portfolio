"use client";

import { useEffect } from "react";
import { getCalApi } from "@calcom/embed-react";

type CalBookingLinkProps = {
  href: string;
};

export function CalBookingLink({ href }: CalBookingLinkProps) {
  const calLink = new URL(href).pathname.replace(/^\/+/, "");

  useEffect(() => {
    void (async () => {
      const cal = await getCalApi({ namespace: "15-min-booking" });
      cal("ui", {
        hideEventTypeDetails: false,
        layout: "month_view",
      });
    })();
  }, []);

  return (
    <button
      type="button"
      onClick={() => {
        void (async () => {
          const cal = await getCalApi({ namespace: "15-min-booking" });
          cal("modal", {
            calLink,
            config: {
              layout: "month_view",
              useSlotsViewOnSmallScreen: "true",
            },
          });
        })();
      }}
      className="mt-6 inline-flex min-h-11 items-center bg-ink px-4 text-sm font-medium text-paper transition-colors hover:bg-signal focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
    >
      Book a free 15-minute call
    </button>
  );
}
