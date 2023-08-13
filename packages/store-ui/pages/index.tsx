import { PageContextWithStore } from "../hacks/store";
import { getServerSideResponse } from "../sdk/defaults";
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
  return getServerSideResponse(req, locale, (qc, store) => {
    return [
      qc.prefetchQuery("storeContents", "getLandingContentForStore", [
        store._id,
      ]),
    ]
  })
}

export default HomePage;
