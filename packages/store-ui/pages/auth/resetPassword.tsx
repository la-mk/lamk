import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { Templates } from "../../containers";
import { ResetPassword } from "../../containers/auth/ResetPassword";
import { Store } from "../../domain/store";
import { getStore, PageContextWithStore } from "../../hacks/store";
import { Head } from "../../layout/Head";
import { getDefaultPrefetch } from "../../sdk/defaults";
import { getProps, newClient } from "../../sdk/queryClient";
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
  const store = await getStore(req.headers.host);
  if (!store) {
    return { props: {} };
  }

  const queryClient = newClient();
  await Promise.all(getDefaultPrefetch(queryClient, store));

  return {
    props: {
      ...getProps(queryClient),
      ...(await serverSideTranslations(locale ?? "mk", ["translation"])),
      store,
    },
  };
}

export default ResetPasswordPage;
