export const TRACK_EVENT = 'analytics/TRACK_EVENT';

export interface TrackEventPayload {
  eventName: string;
  [key: string]: string | number | string[] | number[];
}

export function trackEvent(payload: TrackEventPayload) {
  return {
    type: TRACK_EVENT,
    payload: payload,
  };
}
