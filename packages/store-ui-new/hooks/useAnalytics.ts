import { session, AnalyticsEvents } from "@la-mk/analytics";
import { useRouter } from "next/router";
import { useCallback, useContext, useEffect } from "react";
import { CookiesContext } from "../layout/CookiesProvider";
import { analytics } from "../tooling/analytics";
import { useAuth } from "./useAuth";
import { useGlobalState } from "./useGlobalState";

export const useAnalytics = (storeId: string) => {
  const [eventQueue, setEventQueue] = useGlobalState<
    { name: string; payload: any }[]
  >("analytics-event-queue", []);

  const consent = useContext(CookiesContext);
  const { user } = useAuth();
  const router = useRouter();

  const trackEvent = useCallback(
    (eventName: string, payload: any) => {
      const eventPayload = {
        storeId: storeId,
        ...session.getSessionDefaultProperties(),
        ...payload,
      };

      // The user hasn't responded yet, queue the events
      if (consent === null) {
        setEventQueue((eventQueue: { name: string; payload: any }[]) => [
          ...eventQueue,
          { name: eventName, payload: eventPayload },
        ]);
      }

      if (consent?.analytics) {
        if (!analytics) {
          return;
        }

        try {
          analytics.track(eventName, eventPayload);
        } catch (err) {
          console.debug(err);
        }
      }
    },
    [storeId, consent, setEventQueue]
  );

  useEffect(() => {
    if (consent === null || eventQueue.length === 0 || !analytics) {
      return;
    }
    (async () => {
      try {
        if (consent.analytics) {
          await analytics.optIn();
          eventQueue.forEach((event) => {
            trackEvent(event.name, event.payload);
          });

          setEventQueue([]);
        }
      } catch (err) {
        console.debug(err);
      }
    })();
  }, [consent, eventQueue, setEventQueue, trackEvent]);

  useEffect(() => {
    // If the site is loaded from scratch multiple times within a session, don't log anymore.
    const sessionExpired = session.isSessionExpired();
    if (!sessionExpired) {
      return;
    }

    session.initializeSession();
    trackEvent(AnalyticsEvents.openStore, { page: location.href });
  }, [trackEvent]);

  useEffect(() => {
    if (!user || !consent || !analytics) {
      return;
    }

    analytics.identify(user._id);
  }, [consent, user]);

  useEffect(() => {
    const handleRouteChange = (_url: string) => {
      const sessionInfo = session.getSessionInfo();
      if (!sessionInfo) {
        return;
      }

      // Reset the time on every navigation.
      sessionInfo.startTimestamp = Date.now();
      sessionInfo.previousPage = location.href;
      sessionInfo.pageVisits += 1;
      session.setSessionInfo(sessionInfo);
    };

    router.events.on("routeChangeStart", handleRouteChange);
    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [router.events]);

  return {
    trackEvent,
    getSessionInfo:
      typeof window === "undefined"
        ? ((() => {}) as typeof session.getSessionInfo)
        : session.getSessionInfo,
  };
};
