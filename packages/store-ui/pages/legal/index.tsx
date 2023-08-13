import React from "react";
import { PageContextWithStore } from "../../hacks/store";
import { getServerSideResponse } from "../../sdk/defaults";
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
  return getServerSideResponse(req, locale, () => [])
}

export default LegalPage;
