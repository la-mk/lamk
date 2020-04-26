import Analytics from 'analytics';
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
}

export type AnalyticsClient = ReturnType<typeof Analytics>;
export interface AnalyticsOptions {
  debug: boolean;
  app: string;
  trackingId: string;
  eventPrefix: string;
}

// This is only exported as commonJS library (`module` is not in package.json) because lazy loading amplitude
// See https://github.com/amplitude/Amplitude-JavaScript/issues/138, 

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
    }),
  ];

  return Analytics({
    app: app,
    debug,
    version: '1',
    plugins,
  });
};
