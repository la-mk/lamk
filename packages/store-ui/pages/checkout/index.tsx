import { Result, Spinner } from "@la-mk/blocks-ui";
import { useTranslation } from "next-i18next";
import { Store } from "../../domain/store";
import { getImageURL } from "../../hacks/imageUrl";
import { PageContextWithStore } from "../../hacks/store";
import { useAuth } from "../../hooks/useAuth";
import { Head } from "../../layout/Head";
import { Checkout } from "../../containers/checkout";
import { getServerSideResponse } from "../../sdk/defaults";
import { urls } from "../../tooling/url";
import { Templates } from "../../containers";

function CheckoutPage({
  store,
  template,
}: {
  store: Store;
  template: Templates;
}) {
  const { t } = useTranslation("translation");
  const { user, isLoadingUser } = useAuth();

  if (isLoadingUser()) {
    return <Spinner mx="auto" mt={5} isLoaded={false} />;
  }

  if (!user) {
    return (
      <Result status="empty" mt={8} description={t("auth.noUserInformation")} />
    );
  }

  return (
    <>
      <Head
        url={urls.checkout}
        logo={
          store.logo
            ? {
                ...store.logo,
                defaultUrl: getImageURL(store?.logo?._id, store?._id) ?? "",
              }
            : undefined
        }
        store={store}
        title={t("pages.checkout")}
        description={`${t("pages.checkout")}, ${store?.name}`}
      />

      <Checkout template={template} user={user} store={store} />
    </>
  );
}

export async function getServerSideProps({
  locale,
  req,
}: PageContextWithStore) {
  return getServerSideResponse(req, locale, () => [])
}

export default CheckoutPage;
