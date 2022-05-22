import type { NextPage } from "next";
import { PageContextWithStore } from "../hacks/store";
import { getProps, newClient } from "../sdk/queryClient";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { getDefaultPrefetch } from "../sdk/defaults";
import { Store } from "../domain/store";
import { Head } from "../layout/Head";
import { useTranslation } from "next-i18next";
import { Home } from "../pageComponents/home/Home";
import { urls } from "../tooling/url";

const HomePage = ({ store }: { store: Store }) => {
  const { t } = useTranslation();

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
      <Home store={store} />
    </>
  );
};

export async function getServerSideProps({
  locale,
  req: { store },
}: PageContextWithStore) {
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
      ...(await serverSideTranslations(locale ?? "mk", ["translation"])),
      store,
    },
  };
}

export default HomePage;
