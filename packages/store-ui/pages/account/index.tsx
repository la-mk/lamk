import { Result, Spinner } from "@la-mk/blocks-ui";
import { getStore, PageContextWithStore } from "../../hacks/store";
import { getProps, newClient } from "../../sdk/queryClient";
import { getDefaultPrefetch } from "../../sdk/defaults";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useAuth } from "../../hooks/useAuth";
import { Head } from "../../layout/Head";
import { useTranslation } from "next-i18next";
import { Store } from "../../domain/store";
import { urls } from "../../tooling/url";
import { Account } from "../../containers/account";
import { Templates } from "../../containers";

function AccountPage({
  store,
  template,
}: {
  store: Store;
  template: Templates;
}) {
  const { user, isLoadingUser } = useAuth();
  const { t } = useTranslation("translation");

  if (isLoadingUser()) {
    return <Spinner mx="auto" mt={5} isLoaded={false} />;
  }

  if (!user) {
    return (
      <Result status="empty" mt={8} description={t("auth.noUserInformation")} />
    );
  }

  const fullName = `${user.firstName ?? ""} ${user.lastName ?? ""}`;
  const nameDescription = fullName.length < 3 ? user.email : fullName;

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

export default AccountPage;
