import {
  getAnalyticsClient,
  AnalyticsClient,
  session,
  AnalyticsEvents,
} from '@la-mk/analytics';
import env from './env';
export let analytics: AnalyticsClient | undefined;

export const initializeAnalytics = () => {
  if (analytics) {
    return;
  }

  analytics = getAnalyticsClient({
    trackingId: env.ANALYTICS_TRACKING_ID,
    debug: env.NODE_ENV === 'development',
    eventPrefix: 'landing',
    app: 'landing-ui',
  });
};

export const track = (eventName: AnalyticsEvents, payload: any = {}) => {
  analytics.track(eventName, {
    ...payload,
    ...session.getSessionDefaultProperties(),
    page: document.location.href,
  });
};

export const trackInitialLoad = async () => {
  // If the site is loaded from scratch multiple times within a session, don't log anymore.
  const sessionExpired = session.isSessionExpired();
  if (!sessionExpired) {
    return;
  }

  session.initializeSession();
  // TODO: For now we just opt-in by default, fix it.
  await analytics.optIn();
  track(AnalyticsEvents.openMarketingSite);
};
