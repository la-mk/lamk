import Analytics, { AnalyticsInstance } from 'analytics';
import amplitudePlugin from './plugins/analytics-plugin-amplitude';
import debugPlugin from './plugins/analytics-plugin-debug';
export { session, SessionInfo } from './session';

export enum AnalyticsEvents {
  openStore = 'open store',
  viewProduct = 'view product',
  viewCart = 'view cart',
  register = 'register',
  addAddress = 'add address',
  addItemToCart = 'add item to cart',
  removeItemFromCart = 'remove item from cart',
  checkout = 'checkout',
  order = 'order',
  pay = 'pay',

  openMarketingSite = 'open marketing site',
  openVideo = 'open video',
  openDemoStore = 'open demo store',
  clickStartNow = 'click start now',
  submitContactUs = 'submit contact us',

  pageView = 'page view',
}

export type AnalyticsClient = ReturnType<typeof Analytics> & {
  optIn: () => Promise<void>;
};

export interface AnalyticsOptions {
  debug: boolean;
  app: string;
  trackingId: string;
  eventPrefix: string;
}

export const getAnalyticsClient = ({
  debug,
  app,
  trackingId,
  eventPrefix,
}: AnalyticsOptions): AnalyticsClient => {
  const plugins = [
    ...(debug ? [debugPlugin()] : []),
    amplitudePlugin({
      eventPrefix,
      trackingId,
      enabled: false,
    }),
  ];

  const client: AnalyticsInstance = Analytics({
    app: app,
    debug,
    version: '1',
    plugins,
  });

  (client as AnalyticsClient).optIn = () => {
    return client.plugins.enable('amplitude' as any);
  };

  return client as AnalyticsClient;
};
