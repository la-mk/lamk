import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Store } from "../../domain/store";
import { getImageURL } from "../../hacks/imageUrl";
import { PageContextWithStore } from "../../hacks/store";
import { Head } from "../../layout/Head";
import { getDefaultPrefetch } from "../../sdk/defaults";
import { getProps, newClient } from "../../sdk/queryClient";
import { useQuery } from "../../sdk/useQuery";
import { getTextSnippet } from "../../tooling/text";
import { urls } from "../../tooling/url";
import { AboutUs } from "../../pageComponents/about/AboutUs";

function About({ store }: { store: Store }) {
  const { t } = useTranslation("translation");
  const [aboutUs] = useQuery("storeContents", "getAboutUsForStore", [
    store._id,
  ]);

  return (
    <>
      <Head
        url={urls.about}
        logo={
          store.logo
            ? {
                ...store.logo,
                defaultUrl: getImageURL(store?.logo?._id, store?._id) ?? "",
              }
            : undefined
        }
        store={store}
        title={t("pages.aboutUs")}
        description={
          getTextSnippet(aboutUs?.description) ??
          `${t("pages.aboutUs")}, ${store?.name}`
        }
      />

      <AboutUs markdownDescription={aboutUs?.description} />
    </>
  );
}

export async function getServerSideProps({
  locale,
  req: { store },
}: PageContextWithStore) {
  if (!store) {
    return { props: {} };
  }

  const queryClient = newClient();
  await Promise.all([
    ...getDefaultPrefetch(queryClient, store),
    queryClient.prefetchQuery("storeContents", "getAboutUsForStore", [
      store._id,
    ]),
  ]);

  return {
    props: {
      ...getProps(queryClient),
      ...(await serverSideTranslations(locale ?? "mk", ["translation"])),
    },
  };
}

export default About;
