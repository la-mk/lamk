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

const getGeneralRules = ({
  storeName,
  companyName,
  registryNumber,
  taxNumber,
  companyAddress,
}: {
  storeName: string;
  companyName: string;
  registryNumber: string;
  taxNumber: string;
  companyAddress: string;
}) => {
  return `
Како би ги задоволиле Вашите потреби и барања, ${storeName} ќе се залага за достапност на својата интернет страна 24 часа во денот. Во случај на привремена недостапност односно прекин на интернет страната поради технички или надворешни влијанија надвор од контролата на ${storeName}, не превземаме никаква одговорност и не гарантираме постојан пристап.

Сите податоци и информации објавени на интернет страната на ${storeName} се од информативен карактер и за истите ${storeName} го задржува правото за промена и менување во зависност од условите и потребите.

Како резултат на специфичноста на медиумот “интернет“, доколку поинаку не е предвидено согласно позитивните прописи во Р.С.Македонија, ${storeName} не превзема одговорност за точноста и веродостојноста на објавените информации и документи.
Називот "${storeName}" е трговски знак на Друштво за производтво, услуги и трговија на големо и мало ${companyName} со седиште: ${companyAddress} и Е.М.Б.С ${registryNumber}, Е.Д.Б ${taxNumber} и се забранува секаков вид на негова употреба без претходна писмена согласност од ${companyName}. ${companyName} ги задржува сите права кои произлегуваат од трговскиот знак "${storeName}".

Превземањето на информации, податоци и слики, нивна дистрибуција, пренос или користење на линкот од интернет страната на ${storeName} е забрането. Употребата на истите е можна само за некомерцијални цели и лична употреба надвор од дозволеноста за било каква злоупотребата на податоците и опциите кои ги нуди интернет страната на ${storeName}.

Сакаме да знаете дека овој сајт користи текстуални датотеки наречени "cookies". Без нив сајтот нема да функционира правилно и многу од опциите нема да можете да ги видите. Повеќе информации за тоа што се "cookies" и какви типови има можете да најдете тука: https://en.wikipedia.org/wiki/HTTP_cookie.
`.trim();
};

const GeneralRulesPage = ({ store }: { store: Store }) => {
  const { t } = useTranslation("translation");
  const title = t("pages.generalRules");
  if (!store.company) {
    return (
      <>
        <Head
          url={urls.generalRules}
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

  const generalRules = getGeneralRules({
    storeName: store.name,
    companyName: store.company.companyName,
    registryNumber: store.company.registryNumber,
    taxNumber: store.company.taxNumber,
    companyAddress: store.company.companyAddress,
  });

  return (
    <>
      <Head
        url={urls.generalRules}
        store={store}
        title={title}
        description={getTextSnippet(generalRules)}
      />
      <LegalContent url={urls.generalRules} title={title} body={generalRules} />
    </>
  );
};

export async function getServerSideProps({
  locale,
  req: { store },
}: PageContextWithStore) {
  if (!store) {
    return { props: {} };
  }

  const queryClient = newClient();
  await Promise.all(getDefaultPrefetch(queryClient, store));

  return {
    props: {
      ...getProps(queryClient),
      ...(await serverSideTranslations(locale ?? "mk", ["translation"])),
    },
  };
}

export default GeneralRulesPage;
