import Analytics, { AnalyticsInstance } from 'analytics';
import debugPlugin from './analytics-plugin-debug';
import amplitudePlugin from './analytics-plugin-amplitude';
import env from '../common/env';

export let analytics: AnalyticsInstance | undefined;

export const initialize = (storeSlug?: string) => {
  const debug = env.NODE_ENV === 'development';
  const plugins = debug
    ? [debugPlugin({})]
    : [amplitudePlugin({ trackingId: env.ANALYTICS_TRACKING_ID })];

  analytics = Analytics({
    app: storeSlug || 'unknown',
    debug,
    version: '1',
    plugins,
  });
};
