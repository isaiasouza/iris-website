"use client";

import { useEffect } from "react";
import { PURCHASE_CURRENCY } from "@/lib/purchase";

type TrackingFunction = (...args: unknown[]) => void;

declare global {
  interface Window {
    fbq?: TrackingFunction;
    gtag?: TrackingFunction;
  }
}

interface PurchaseTrackerProps {
  orderId: string;
  value: number;
}

const RETRY_INTERVAL_MS = 500;
const RETRY_WINDOW_MS = 120_000;

/**
 * Envia Purchase somente quando os trackers já estiverem disponíveis.
 * Assim, esta página não carrega Meta Pixel ou GA4 antes do consentimento.
 */
export function PurchaseTracker({ orderId, value }: PurchaseTrackerProps) {
  useEffect(() => {
    const gaKey = `iris:purchase:ga4:${orderId}`;
    const metaKey = `iris:purchase:meta:${orderId}`;
    const eventId = `purchase-${orderId}`;
    const startedAt = Date.now();
    let timer: number | undefined;

    const wasSent = (key: string) => window.sessionStorage.getItem(key) === "1";
    const markAsSent = (key: string) => window.sessionStorage.setItem(key, "1");

    const sendPurchase = () => {
      if (window.gtag && !wasSent(gaKey)) {
        window.gtag("event", "purchase", {
          transaction_id: orderId,
          value,
          currency: PURCHASE_CURRENCY,
        });
        markAsSent(gaKey);
      }

      if (window.fbq && !wasSent(metaKey)) {
        window.fbq(
          "track",
          "Purchase",
          { value, currency: PURCHASE_CURRENCY },
          { eventID: eventId },
        );
        markAsSent(metaKey);
      }

      const finished = wasSent(gaKey) && wasSent(metaKey);
      const expired = Date.now() - startedAt >= RETRY_WINDOW_MS;
      if ((finished || expired) && timer !== undefined) {
        window.clearInterval(timer);
        timer = undefined;
      }
    };

    sendPurchase();
    timer = window.setInterval(sendPurchase, RETRY_INTERVAL_MS);
    window.addEventListener("iris:tracking-ready", sendPurchase);

    return () => {
      if (timer !== undefined) window.clearInterval(timer);
      window.removeEventListener("iris:tracking-ready", sendPurchase);
    };
  }, [orderId, value]);

  return null;
}
