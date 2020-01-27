// Currently it works only in the browser, so we lazily load the sdk inside the initialization method.
export default function amplitude(pluginConfig: { trackingId?: string } = {}) {
  let amplitudeSdk: any;
  return {
    NAMESPACE: 'amplitude',
    config: pluginConfig,
    loaded: () => Boolean(amplitudeSdk),
    initialize: ({ config }: any) => {
      if (!config.trackingId) {
        console.error("No amplitude key provided, amplitude won't be used");
        return;
      }

      if (amplitudeSdk) {
        return;
      }

      amplitudeSdk = require('amplitude-js/amplitude');
      amplitudeSdk.getInstance().init(config.trackingId);
    },

    page: ({ payload }) => {
      if (!amplitudeSdk) {
        return;
      }
      amplitudeSdk.getInstance().logEvent('pageview', payload.properties);
    },

    track: ({ payload }) => {
      if (!amplitudeSdk) {
        return;
      }
      amplitudeSdk.getInstance().logEvent(payload.type, payload);
    },

    identify: ({ payload }) => {
      if (!amplitudeSdk) {
        return;
      }
      amplitudeSdk.getInstance().setUserId(payload.userId, payload.traits);
    },

    reset: () => {
      if (!amplitudeSdk) {
        return;
      }
      amplitudeSdk.getInstance().setUserId(null);
      amplitudeSdk.getInstance().regenerateDeviceId();
    },
  };
}
