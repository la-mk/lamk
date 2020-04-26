export interface AmplitudeConfig {
  trackingId: string;
  eventPrefix: string;
}
// Currently it works only in the browser, so we lazily load the sdk inside the initialization method.
export default function amplitude(pluginConfig: AmplitudeConfig) {
  let amplitudeSdk: any;

  return {
    NAMESPACE: 'amplitude',
    config: pluginConfig,
    loaded: () => Boolean(amplitudeSdk),
    initialize: ({ config }: { config: AmplitudeConfig }) => {
      if (!config?.trackingId) {
        console.error("No amplitude key provided, amplitude won't be used");
        return;
      }

      if (amplitudeSdk) {
        return;
      }

      amplitudeSdk = require('amplitude-js');

      amplitudeSdk.getInstance().init(config.trackingId, null, {
        includeUtm: true,
        includeReferrer: true,
        includeGclid: true,
        // It will check for amp_device_id query param and parse it.
        deviceIdFromUrlParam: true,
        optOut: false,
      });
    },

    page: ({ payload }: { payload: any }) => {
      if (!amplitudeSdk) {
        return;
      }
      amplitudeSdk
        .getInstance()
        .logEvent(`${pluginConfig.eventPrefix}: pageview`, payload.properties);
    },

    track: ({ payload }: { payload: any }) => {
      if (!amplitudeSdk) {
        return;
      }
      amplitudeSdk
        .getInstance()
        .logEvent(
          `${pluginConfig.eventPrefix}: ${payload.event}`,
          payload.properties
        );
    },

    identify: ({ payload }: { payload: any }) => {
      if (!amplitudeSdk) {
        return;
      }

      amplitudeSdk.getInstance().setUserId(payload.userId);
      amplitudeSdk.getInstance().setUserProperties(payload.traits);
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
