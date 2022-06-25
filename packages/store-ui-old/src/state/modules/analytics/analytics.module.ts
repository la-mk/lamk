export const TRACK_EVENT = 'analytics/TRACK_EVENT';
export const CONSENTS_CHANGE = 'analytics/CONSENTS_CHANGE';

export interface TrackEventPayload {
  eventName: string;
  [key: string]: string | number | string[] | number[];
}

export interface ConsentPreferences {
  analytics: boolean;
}

const initialState: { consents: ConsentPreferences } = { consents: null };

export default function analytics(state = initialState, action: any) {
  switch (action.type) {
    case CONSENTS_CHANGE: {
      return { consents: action.payload };
    }
    default:
      return state;
  }
}

export function trackEvent(payload: TrackEventPayload) {
  return {
    type: TRACK_EVENT,
    payload: payload,
  };
}

export function consentsChange(payload: ConsentPreferences) {
  return {
    type: CONSENTS_CHANGE,
    payload: payload,
  };
}
