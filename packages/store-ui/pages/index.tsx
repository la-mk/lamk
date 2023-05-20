import { getStore, PageContextWithStore } from "../hacks/store";
import { getProps, newClient } from "../sdk/queryClient";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { getDefaultPrefetch } from "../sdk/defaults";
import { Store } from "../domain/store";
import { Head } from "../layout/Head";
import { useTranslation } from "next-i18next";
import { urls } from "../tooling/url";
import { Home } from "../containers/home";
import { Templates } from "../containers";

const HomePage = ({
  store,
  template,
}: {
  store: Store;
  template: Templates;
}) => {
  const { t } = useTranslation("translation");

  return (
    <>
      <Head
        url={urls.home}
        store={store}
        title={store?.name ?? store?.slug ?? t("pages.home")}
        description={
          store?.slogan ??
          `${store?.name} - ${t("seoDescriptions.storeGeneric")}`
        }
      />
      <Home template={template} store={store} />
    </>
  );
};

export async function getServerSideProps({
  locale,
  req,
}: PageContextWithStore) {
  const store = await getStore(req.headers.host);
  if (!store) {
    return { props: {} };
  }

  const queryClient = newClient();
  await Promise.all([
    ...getDefaultPrefetch(queryClient, store),
    queryClient.prefetchQuery("storeContents", "getLandingContentForStore", [
      store._id,
    ]),
  ]);

  return {
    props: {
      ...getProps(queryClient),
      ...(await serverSideTranslations(locale ?? "mk", [
        "translation",
        "custom",
      ])),
      store,
    },
  };
}

export default HomePage;
