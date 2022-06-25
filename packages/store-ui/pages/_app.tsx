import type { AppContext, AppProps } from "next/app";
import App from "next/app";

import { appWithTranslation } from "next-i18next";
import { Hydrate, QueryClientProvider } from "react-query";
import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import { sdk, setupSdk } from "../sdk/sdk";
import { ThemeProvider } from "../layout/ThemeProvider";
import { CookiesProvider } from "../layout/CookiesProvider";
import { newClient } from "../sdk/queryClient";
import { envvars, loadEnv } from "../tooling/env";
import { StoreNotFound } from "../layout/StoreNotFound";
import { StoreLayout } from "../layout/StoreLayout";
import { getStoreFromHost } from "../hacks/dns";
import { Store } from "../domain/store";
import Head from "next/head";
import { Integrations } from "../integrations/Integrations";
import { injectStoreInContext } from "../hacks/store";
import { getImageURL } from "../hacks/imageUrl";
import { AuthProvider } from "../layout/Auth/AuthProvider";
import { analytics, initializeAnalytics } from "../tooling/analytics";

function MyApp({
  Component,
  pageProps,
  store,
}: AppProps & { store: Store | null }) {
  const [queryClient] = useState(() => newClient());
  const { t } = useTranslation("translation");
  // The SDK is a singleton, so it's safe to do this check
  if (!sdk) {
    loadEnv();
    setupSdk({
      transport: "rest",
      apiEndpoint: envvars.API_ENDPOINT,
      imagesEndpoint: envvars.ARTIFACTS_ENDPOINT,
      imagesProxyEndpoint: envvars.IMAGES_PROXY_ENDPOINT,
    });
  }

  // We only want to enable analytics in the browser
  if (!analytics && typeof window !== "undefined") {
    initializeAnalytics();
  }

  return (
    <ThemeProvider brandColor={store?.color ?? "#EF4351"}>
      {!!store ? (
        <>
          <Head>
            <link
              rel="shortcut icon"
              href={
                getImageURL(store.logo?._id ?? "", store._id, {
                  h: 128,
                }) ?? ""
              }
            />
          </Head>

          <CookiesProvider
            necessaryTitle={t("common.necessary")}
            analyticsTitle={t("common.analytics")}
          >
            <QueryClientProvider client={queryClient._qc}>
              <Hydrate state={pageProps.dehydratedState}>
                <AuthProvider store={store}>
                  <>
                    <StoreLayout store={store}>
                      <Component {...pageProps} store={store} />
                    </StoreLayout>
                    <Integrations store={store} />
                  </>
                </AuthProvider>
              </Hydrate>
            </QueryClientProvider>
          </CookiesProvider>
        </>
      ) : (
        <StoreNotFound />
      )}
    </ThemeProvider>
  );
}

MyApp.getInitialProps = async (appContext: AppContext) => {
  if (appContext.ctx.req) {
    let host = appContext.ctx.req.headers.host;
    if (!host) {
      throw new Error("Store request misconfigured");
    }

    // If we are running the store UI locally, get it from the enviornment
    host = envvars.DEV_STORE_URL || host;
    const store = await getStoreFromHost(
      host,
      envvars.API_ENDPOINT,
      sdk.store.getBySlug,
      sdk.store.getByDomain
    );

    injectStoreInContext(store, appContext);
    const appProps = await App.getInitialProps(appContext);
    return { ...appProps, store };
  }
};

export default appWithTranslation(MyApp);
