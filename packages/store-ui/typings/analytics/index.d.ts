declare module 'analytics' {
  export interface AnalyticsPageData {
    title?: string;
    url?: string;
    path?: string;
    search?: string;
    width?: string;
    height?: string;
  }

  export interface AnalyticsInstance {
    page: (
      pageOverrides?: AnalyticsPageData,
      options?: any,
      callback?: () => void,
    ) => void;

    track: (
      eventName?: string,
      payload?: any,
      options?: any,
      callback?: () => void,
    ) => void;

    identify: (
      userId: string,
      traits?: any,
      options?: any,
      callback?: () => void,
    ) => void;

    // Reset the user's state
    reset: (callback?: () => void) => void;

    // Key can be `userId` or `trait.x.y` path
    user: (key?: string) => any;

    ready: (callback?: () => void) => void;
  }

  const Analytics: (config: {
    app: string;
    version: string;
    debug: boolean;
    plugins: Array<any>;
  }) => AnalyticsInstance;
  export = Analytics;
}
