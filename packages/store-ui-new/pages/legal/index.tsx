import React from "react";
import { PageContextWithStore } from "../../hacks/store";
import { getProps, newClient } from "../../sdk/queryClient";
import { getDefaultPrefetch } from "../../sdk/defaults";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { Store } from "../../domain/store";
import { Head } from "../../layout/Head";
import { Legal } from "../../pageComponents/legal/Legal";

function LegalPage({ store }: { store: Store }) {
  const { t } = useTranslation("translation");
  return (
    <>
      <Head
        url={`/legal`}
        store={store}
        title={t("pages.legal")}
        description={`${t("pages.legal")}, ${store?.name}`}
      />
      <Legal />
    </>
  );
}

export async function getServerSideProps({
  locale,
  req: { store },
}: PageContextWithStore) {
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

export default LegalPage;
