import { PageContextWithStore } from "../../hacks/store";
import { getServerSideResponse } from "../../sdk/defaults";
import { useAuth } from "../../hooks/useAuth";
import { Head } from "../../layout/Head";
import { useTranslation } from "next-i18next";
import { Store } from "../../domain/store";
import { urls } from "../../tooling/url";
import { Account } from "../../containers/account";
import { Templates } from "../../containers";
import { NextPageWithLayout } from "../_app";
import React, { ReactElement } from "react";
import { Layout as AccountLayout } from "../../containers/account/Layout";

const AccountPage = ({
  store,
  template,
}: NextPageWithLayout & {
  store: Store;
  template: Templates;
}) => {
  const { user } = useAuth();
  const { t } = useTranslation("translation");

  const fullName = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`;
  const nameDescription = fullName.length < 3 ? user?.email : fullName;

  return (
    <>
      <Head
        url={urls.account}
        store={store}
        title={t("pages.myAccount")}
        description={`${t("pages.myAccount")}, ${nameDescription}`}
      />
      <Account template={template} user={user} />
    </>
  );
};

AccountPage.getLayout = (page: ReactElement, template: Templates) => {
  return <AccountLayout template={template}>{page}</AccountLayout>;
};

export async function getServerSideProps({
  locale,
  req,
}: PageContextWithStore) {
  return getServerSideResponse(req, locale, () => [])
}

export default AccountPage;
