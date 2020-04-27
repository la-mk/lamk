import { getAnalyticsClient, AnalyticsClient } from '@sradevski/analytics';
import env from '../common/env';

export let analytics: AnalyticsClient | undefined;

export const initializeAnalytics = (storeSlug?: string) => {
  if (analytics) {
    return;
  }

  analytics = getAnalyticsClient({
    trackingId: env.ANALYTICS_TRACKING_ID,
    debug: env.NODE_ENV === 'development',
    eventPrefix: 'store',
    app: storeSlug || 'unknown',
  });
};
