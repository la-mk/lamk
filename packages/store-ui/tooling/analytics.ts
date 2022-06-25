import { getAnalyticsClient, AnalyticsClient } from "@la-mk/analytics";
import { envvars } from "./env";

export let analytics: AnalyticsClient | undefined;

export const initializeAnalytics = (storeSlug?: string) => {
  if (analytics) {
    return;
  }

  analytics = getAnalyticsClient({
    trackingId: envvars.ANALYTICS_TRACKING_ID ?? "",
    debug: envvars.NODE_ENV === "development",
    eventPrefix: "store",
    app: storeSlug || "unknown",
  });
};
