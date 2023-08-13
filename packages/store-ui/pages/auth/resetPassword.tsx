import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { Templates } from "../../containers";
import { ResetPassword } from "../../containers/auth/ResetPassword";
import { Store } from "../../domain/store";
import {  PageContextWithStore } from "../../hacks/store";
import { Head } from "../../layout/Head";
import { getServerSideResponse } from "../../sdk/defaults";
import { urls } from "../../tooling/url";

function ResetPasswordPage({
  store,
  template,
}: {
  store: Store;
  template: Templates;
}) {
  const { t } = useTranslation("translation");
  const router = useRouter();
  return (
    <>
      <Head
        url={urls.resetPassword}
        store={store}
        title={t("auth.resetPassword")}
        description={`${t("auth.resetPassword")}, ${store?.name}`}
      />

      <ResetPassword
        template={template}
        resetToken={router.query.resetToken as string | undefined}
      />
    </>
  );
}

export async function getServerSideProps({
  locale,
  req,
}: PageContextWithStore) {
  return getServerSideResponse(req, locale, () => [])
}

export default ResetPasswordPage;
