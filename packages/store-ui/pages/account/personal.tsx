import { getServerSideResponse } from "../../sdk/defaults";
import { PageContextWithStore } from "../../hacks/store";
import { useAuth } from "../../hooks/useAuth";
import { useTranslation } from "next-i18next";
import { Head } from "../../layout/Head";
import { Store } from "../../domain/store";
import { urls } from "../../tooling/url";
import { Personal } from "../../containers/account/Personal";
import { Templates } from "../../containers";
import { Layout as AccountLayout } from "../../containers/account/Layout";
import { ReactElement } from "react";
import { NextPageWithLayout } from "../_app";

function PersonalPage({
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
        url={urls.accountPersonal}
        store={store}
        title={t("pages.myAccount")}
        description={`${t("pages.myAccount")}, ${nameDescription}`}
      />
      <Personal template={template} user={user} />
    </>
  );
}

PersonalPage.getLayout = (page: ReactElement, template: Templates) => {
  return <AccountLayout template={template}>{page}</AccountLayout>;
};

export async function getServerSideProps({
  locale,
  req,
}: PageContextWithStore) {
  return getServerSideResponse(req, locale, () => [])
}

export default PersonalPage;
