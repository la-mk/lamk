import React from "react";
import { Result } from "@la-mk/blocks-ui";
import { PageContextWithStore } from "../../hacks/store";
import { getProps, newClient } from "../../sdk/queryClient";
import { getDefaultPrefetch } from "../../sdk/defaults";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { Store } from "../../domain/store";
import { Head } from "../../layout/Head";
import { getTextSnippet } from "../../tooling/text";
import { LegalContent } from "../../pageComponents/legal/LegalContent";
import { urls } from "../../tooling/url";

const getReturnAndRefundPolicy = ({ storeName }: { storeName: string }) => {
  return `
Потрошувачот има право во ${storeName} да го замени или врати производот што има соодветен квалитет, а што не одговара во однос на формата, големината, моделот, бојата, бројот или од други причини, освен во случај на купен производ изготвен по нарачка од потрошувачот врз основа на писмен договор, што е во согласност со член 50 од Законот за заштита на потрошувачите.

Потрошувачот правото за замена односно враќање на производ може да го оствари во рок од 15 дена сметано од денот на подигање т.е. достава на производот.

За остварување на правото за замена односно враќање на производ согласно оваа Одлука важат следните законски услови:
- производот не бил употребуван;
- сочувани се: изгледот, употребните својства, пломбите и фабричките етикети на производот;
- при поднесување на барање за замена, односно враќање на производ, со призводот задолжително се приложува фискалната сметка или сметкопотврдата и целокупната друга пропратна документација која на Потрошувачот му била издаденa заедно со производот.

По истекот на рокот од 15 дена од денот на подигање т.е. достава на производот, потрошувачот го губи правото на замена, односно враќање на производ по овој основ. Сите поднесени Барањата за замена, односно враќање на производ, сметано од 16-тиот ден од денот кога производот е примен од потрошувачот, ќе бидат негативно одговорени. Замената, односно враќањето на производот Потрошувачот може да го реализира во било кој продажен салон на ${storeName}, независно од тоа каде е извршена купопродажбата.

Наведената Политика за замена, односно враќање на производ на барање на потрошувач се применува во сите ${storeName} продажни салони од 2020 година. За сите производи купени до 2020 година важи и се применува правилото за замена односно враќање на производ на барање на потрошувач во рок од 15 дена сметано од денот кога производот е купен.
`.trim();
};

const ReturnAndRefundPage = ({ store }: { store: Store }) => {
  const { t } = useTranslation("translation");
  const title = t("pages.returnAndRefund");
  if (!store.company) {
    return (
      <>
        <Head
          url={urls.returnsAndRefunds}
          store={store}
          title={title}
          description={title}
        />
        <Result
          status="empty"
          mt={8}
          description={t("legal.legalNotAvailable")}
        />
      </>
    );
  }

  const returnAndRefundPolicy = getReturnAndRefundPolicy({
    storeName: store.name,
  });

  return (
    <>
      <Head
        url={urls.returnsAndRefunds}
        store={store}
        title={title}
        description={getTextSnippet(returnAndRefundPolicy)}
      />
      <LegalContent
        url={urls.returnsAndRefunds}
        title={title}
        body={returnAndRefundPolicy}
      />
    </>
  );
};

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

export default ReturnAndRefundPage;
