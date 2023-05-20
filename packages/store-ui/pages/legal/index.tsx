import React from "react";
import { getStore, PageContextWithStore } from "../../hacks/store";
import { getProps, newClient } from "../../sdk/queryClient";
import { getDefaultPrefetch } from "../../sdk/defaults";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { Store } from "../../domain/store";
import { Head } from "../../layout/Head";
import { urls } from "../../tooling/url";
import { Legal } from "../../containers/legal/List";
import { Templates } from "../../containers";

function LegalPage({ store, template }: { store: Store; template: Templates }) {
  const { t } = useTranslation("translation");
  return (
    <>
      <Head
        url={urls.legal}
        store={store}
        title={t("pages.legal")}
        description={`${t("pages.legal")}, ${store?.name}`}
      />
      <Legal template={template} />
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
      ...(await serverSideTranslations(locale ?? "mk", [
        "translation",
        "custom",
      ])),
      store,
    },
  };
}

export default LegalPage;
