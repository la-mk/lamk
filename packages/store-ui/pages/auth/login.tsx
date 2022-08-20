import { Spinner } from "@la-mk/blocks-ui";
import { getProps, newClient } from "../../sdk/queryClient";
import { getDefaultPrefetch } from "../../sdk/defaults";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { getStore, PageContextWithStore } from "../../hacks/store";
import { useAuth } from "../../hooks/useAuth";
import { useTranslation } from "next-i18next";
import { Head } from "../../layout/Head";
import { Store } from "../../domain/store";
import { urls } from "../../tooling/url";
import { Templates } from "../../containers";
import { Login } from "../../containers/auth/Login";

function LoginPage({ store, template }: { store: Store; template: Templates }) {
  const { isLoadingUser } = useAuth();
  const { t } = useTranslation("translation");

  if (isLoadingUser()) {
    return <Spinner mx="auto" mt={5} isLoaded={false} />;
  }

  return (
    <>
      <Head
        url={urls.login}
        store={store}
        title={t("pages.myAccount")}
        description={`${t("pages.myAccount")}`}
      />
      <Login template={template} />
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

export default LoginPage;
