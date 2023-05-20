import { Result, Spinner } from "@la-mk/blocks-ui";
import { getStore, PageContextWithStore } from "../../hacks/store";
import { getProps, newClient } from "../../sdk/queryClient";
import { getDefaultPrefetch } from "../../sdk/defaults";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useAuth } from "../../hooks/useAuth";
import { Store } from "../../domain/store";
import { useTranslation } from "next-i18next";
import { Head } from "../../layout/Head";
import { urls } from "../../tooling/url";
import { Addresses } from "../../containers/account/Addresses";
import { Templates } from "../../containers";
import { Layout as AccountLayout } from "../../containers/account/Layout";
import { ReactElement } from "react";
import { NextPageWithLayout } from "../_app";

function AddressesPage({
  store,
  template,
}: NextPageWithLayout & {
  store: Store;
  template: Templates;
}) {
  const { user } = useAuth();
  const { t } = useTranslation("translation");

  const fullName = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`;
  const nameDescription = fullName.length < 3 ? user?.email : fullName;

  return (
    <>
      <Head
        url={urls.accountAddresses}
        store={store}
        title={t("pages.myAccount")}
        description={`${t("pages.myAccount")}, ${nameDescription}`}
      />

      <Addresses template={template} user={user} store={store} />
    </>
  );
}

AddressesPage.getLayout = (page: ReactElement, template: Templates) => {
  return <AccountLayout template={template}>{page}</AccountLayout>;
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
  await Promise.all(getDefaultPrefetch(queryClient, store));

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

export default AddressesPage;
