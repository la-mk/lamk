import { Spinner } from "@la-mk/blocks-ui";
import { useTranslation } from "next-i18next";
import { Store } from "../../domain/store";
import { getImageURL } from "../../hacks/imageUrl";
import { PageContextWithStore } from "../../hacks/store";
import { useAuth } from "../../hooks/useAuth";
import { Head } from "../../layout/Head";
import { Cart } from "../../containers/cart";
import { getServerSideResponse } from "../../sdk/defaults";
import { urls } from "../../tooling/url";
import { Templates } from "../../containers";

function CartPage({ store, template }: { store: Store; template: Templates }) {
  const { t } = useTranslation("translation");
  const { user, isLoadingUser } = useAuth();

  if (isLoadingUser()) {
    return <Spinner mx="auto" mt={5} isLoaded={false} />;
  }

  return (
    <>
      <Head
        url={urls.cart}
        logo={
          store.logo
            ? {
                ...store.logo,
                defaultUrl: getImageURL(store?.logo?._id, store?._id) ?? "",
              }
            : undefined
        }
        store={store}
        title={t("pages.cart")}
        description={`${t("pages.cart")}, ${store?.name}`}
      />

      <Cart template={template} user={user} store={store} />
    </>
  );
}

export async function getServerSideProps({
  locale,
  req,
}: PageContextWithStore) {
  return getServerSideResponse(req, locale, () => [])
}

export default CartPage;
