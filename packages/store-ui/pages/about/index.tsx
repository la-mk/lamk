import { useTranslation } from "next-i18next";
import { Store } from "../../domain/store";
import { getImageURL } from "../../hacks/imageUrl";
import {  PageContextWithStore } from "../../hacks/store";
import { Head } from "../../layout/Head";
import { getServerSideResponse } from "../../sdk/defaults";
import { useQuery } from "../../sdk/useQuery";
import { getTextSnippet } from "../../tooling/text";
import { urls } from "../../tooling/url";
import { AboutUs } from "../../containers/about";
import { Templates } from "../../containers";

function About({ store, template }: { store: Store; template: Templates }) {
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

      <AboutUs template={template} markdownDescription={aboutUs?.description} />
    </>
  );
}

export async function getServerSideProps({
  locale,
  req,
}: PageContextWithStore) {
  return getServerSideResponse(req, locale, (qc, store) => [
    qc.prefetchQuery("storeContents", "getAboutUsForStore", [
      store._id,
    ]),
  ])
}

export default About;
