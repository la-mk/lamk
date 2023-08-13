import { PageContextWithStore } from "../../hacks/store";
import { getServerSideResponse } from "../../sdk/defaults";
import { useAuth } from "../../hooks/useAuth";
import { useTranslation } from "next-i18next";
import { Head } from "../../layout/Head";
import { ChangePassword } from "../../containers/account/ChangePassword";
import { Store } from "../../domain/store";
import { urls } from "../../tooling/url";
import { Templates } from "../../containers";
import { Layout as AccountLayout } from "../../containers/account/Layout";
import { NextPageWithLayout } from "../_app";
import { ReactElement } from "react";

function ChangePasswordPage({
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
        url={urls.accountChangePassword}
        store={store}
        title={t("pages.myAccount")}
        description={`${t("pages.myAccount")}, ${nameDescription}`}
      />
      <ChangePassword template={template} user={user} />
    </>
  );
}

ChangePasswordPage.getLayout = (page: ReactElement, template: Templates) => {
  return <AccountLayout template={template}>{page}</AccountLayout>;
};

export async function getServerSideProps({
  locale,
  req,
}: PageContextWithStore) {
  return getServerSideResponse(req, locale, () => [])
}

export default ChangePasswordPage;
