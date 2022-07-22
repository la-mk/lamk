import type { AppProps } from "next/app";
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
import { Store } from "../domain/store";
import Head from "next/head";
import NextNProgress from "nextjs-progressbar";
import { Integrations } from "../integrations/Integrations";
import { getImageURL } from "../hacks/imageUrl";
import { AuthProvider } from "../layout/Auth/AuthProvider";
import { analytics, initializeAnalytics } from "../tooling/analytics";
import { Header } from "../containers/layout/Header";
import { Shell } from "../containers/layout/Shell";
import { Footer } from "../containers/layout/Footer";

function MyApp({
  Component,
  pageProps: { dehydratedState, store, ...otherProps },
}: AppProps & { store: Store | null }) {
  const [queryClient] = useState(() => newClient());
  const { t } = useTranslation("translation");
  const template = "elegant";
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
    <ThemeProvider template={template} brandColor={store?.color ?? "#EF4351"}>
      {!!store ? (
        <>
          <NextNProgress
            color={store?.color ?? "#EF4351"}
            height={1}
            showOnShallow={false}
            options={{
              showSpinner: false,
            }}
          />

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
              <Hydrate state={dehydratedState}>
                <AuthProvider storeId={store._id}>
                  <>
                    <Header template={template} store={store} />
                    <Shell template={template} store={store}>
                      <Component
                        {...otherProps}
                        store={store}
                        template={"elegant"}
                      />
                    </Shell>
                    <Footer template={template} store={store} />
                    <Integrations storeId={store._id} />
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

export default appWithTranslation(MyApp);
