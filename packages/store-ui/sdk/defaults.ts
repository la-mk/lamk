import { QueryClient } from "react-query";
import { Store } from "../domain/store";
import { getStore } from "../hacks/store";
import { getProps, getQueryClient, newClient } from "./queryClient";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { NextIncomingMessage } from "next/dist/server/request-meta";

export const getDefaultPrefetch = (
  qc: ReturnType<typeof getQueryClient>,
  store: Store
) => {
  return [
    qc.prefetchQuery("storeContents", "getLandingContentForStore", [store._id]),
    qc.prefetchQuery("storeCategory", "findForStore", [store._id]),
    qc.prefetchQuery("delivery", "findForStore", [store._id]),
  ];
};

export const getServerSideResponse = async (
  req: NextIncomingMessage,
  locale: string | undefined,
  prefetch: (
    qc: ReturnType<typeof getQueryClient>,
    store: Store
  ) => Array<Promise<void>>,
  otherProps?: { [key: string]: any }
) => {
  const store = await getStore(req.headers.host);
  if (!store) {
    return { props: {} };
  }

  const hasCustomDomain = !!store?.customDomain;
  const isAccessingCustomDomain = !req.headers.host?.includes("la.mk");
  const shouldRedirect = hasCustomDomain && !isAccessingCustomDomain;

  if (shouldRedirect) {
    const dest = `https://${store.customDomain}${req.url}`;
    return {
      redirect: {
        permanent: true,
        destination: dest,
      },
    };
  }

  const queryClient = newClient();
  await Promise.all([
    ...getDefaultPrefetch(queryClient, store),
    ...prefetch(queryClient, store),
  ]);

  return {
    props: {
      ...getProps(queryClient),
      ...(await serverSideTranslations(locale ?? "mk", [
        "translation",
        "custom",
      ])),
      store,
      ...(otherProps ?? {}),
    },
  };
};
