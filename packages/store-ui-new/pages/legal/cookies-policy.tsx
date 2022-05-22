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

const getCookiesPolicy = ({
  slug,
  customDomain,
  companyName,
  companyAddress,
  registryNumber,
  taxNumber,
}: {
  slug: string;
  customDomain?: string;
  companyName: string;
  companyAddress: string;
  registryNumber: string;
  taxNumber: string;
}) => {
  return `
  ## Политика за колачиња на интернет

  Оваа Политиката за колачиња на интернет го уредува начинот на кој **${companyName}** ги користи колачињата на интернет (понатаму: “корисник") при посета на нејзината интернет страната **${slug}.la.mk**, **${
    customDomain ?? ""
  }** и поддомените (понатаму: ”интернет страна").

  **${companyName}** е Друштво за производтво, услуги и трговија на големо и мало со Седиште на Ул. ${companyAddress}, со Е.М.Б.С ${registryNumber} и Е.Д.Б ${taxNumber}, (понатаму: „**${companyName}“**)

  Колачиња (“cookies") се мали текстуални фајлови кои се снимаат на вашиот компјутер или мобилен уред заради подобрување на корисничкото искуство и не се поврзуваат со вашите лични податоци кои претходно сте ни ги доставиле. 

  Со помош на колачињата **${companyName}** го следи движењето на посетителите на интернет страната и на тој начин собира податоци за подобро разбирање за користењето на интернет страната од страна на посетителите, со цел да се подобри корисничкото искуство, да се оптимизира и унапреди функционалноста на интернет страната. 

  Колачињата ни овозможуваат да го препознаеме Вашиот интернет пребарувач, при следната посета на интернет страната. Колачињата може да ги зачуваат Вашите преференции и други технички информации, но не можат да читаат податоци или информации од вашиот хард диск или мобилен телефон, ниту пак да читаат други зачувани фајлови за колачиња од други интернет страни.

  **${companyName}** користи неколку видови на колачиња при работењето на интернет страната:

  - Неопходни колачиња: колачиња кои се неопходни за правилно функционирање на основните функции на веб-страната како навигација, онлајн купување, наплата, статистика за посета на сајтот, оптимизација на содржината и сл. Тие се најчесто поставени како одговор на одредена интеракција која ја имате со веб-страната, како што се прилагодувањата за Поставки на колачиња, најава или пополнување на електронски форми. Овие колачиња не содржат никакви лични информации и не може да се исклучат со овие поставки.
  - Колачиња за аналитика: колачиња кои ни овозможуваат да ги броиме посетите и изворите на сообраќај, со цел да ги измериме и подобриме перформансите на веб-страната. Тие ни помагаат да анализираме кои страници се најпосетени и да видиме како посетителите се движат низ страната. Сите информации што ги собираат овие колачиња се агрегирани и анонимни.
  - Функционални колачиња: колачиња кои овозможуваат подобра функционалност и персонализација на содржината на веб-страната. Тие можат да бидат поставени од страна на **${companyName},** или пак од трети страни, чии услуги сме ги овозможиле на веб-страната. Доколку не се согласите со користење на овие колачиња, некои делови од веб-страната нема правилно да функционираат.
  - Колачиња за маркетинг: колачиња кои можат да бидат поставени преку веб-страната од страна на надворешни партнери. Партнерите може да ги користат колачињата за да Ви покажат релевантни реклами на други веб-страни. Тие директно не ги зачувуваат Вашите лични податоци, туку се насочени кон идентификување на Вашиот интернет пребарувач и/или интернет-уред.
  
  На интернет страната има само таков тип на колачиња што се чуваат на компјутерот на корисникот, согласно во поставките на интернет пребарувачот, кои корисникот ги има поставено. 
  
  Со посетата на интернет страната посетителите може да направат избор кој тип на колачиња сакаат да бидат зачувани на интернет пребарувачот, преку поставките за колачиња. Со кликање на копчето "Прифати колачиња" или со продолжување на користење на веб-страната, се согласувате да ги зачуваме колачињата опишани во овој документ.
  
  Во поставките на својот интернет пребарувач корисниците може да изберат да пребарувачот да ги одбие или избрише колачињата. Доколку корисниците ја одберат таа можност, одредени делови од интернет страната може да не функционираат како што е предвидено.

  ### Ремаркетинг
  
  **${companyName}** информациите кои ги собира преку користењето на колачиња (“cookies"), ги користи за ремаркетинг преку Google AdWords и Facebook, односно за свое рекламирање на други интернет страници кои ќе ги посети корисникот, врз основа на претходна посета на интернет страната и обезбедена согласност за оваа активност.
  Google, Facebook и останати трети страни, прикажуваат реклами односно т.н. "ads" низ различни интернет страници и апликации кои корисникот ги посетува и користи. Овие “ads" се базираат и на претходните кориснички посети на интернет страната на **${companyName}** преку користење на колачиња.
  
  На пример, кога со посетата на нашата интернет страница корисникот се интересирал за одредена услуга или уред без да направи конкретна нарачка, со таквата активност се генерира информација која може да се појави во форма на оглас кај Google и Facebook и на корисникот врз основа на неговиот претходен интерес, при посета на друга интернет страна која исто така користи "ads" на Google да му биде презентирана реклама за **${companyName}** или за содржината која ја посетил на страната на **${companyName}.** Сите собрани податоци од **${companyName}** ќе се користат во согласност со нашата Политиката за приватност, односно со политиките за приватност на Google и Facebook за податоците собрани кај нив.

  Корисникот може целосно да се откаже од ваквиот начин на рекламирање засновано на неговиот претходен интерес со подесување на поставките за колачиња во интернет прелистувачот кој го користи корисникот. DoNotTrack ("DNT") е функционалност која му овозможува на корисникот да го подеси својот интернет пребарувач да ги информира интернет страниците дека неговото движење на интернет не сака да биде следено. "DNT" функционалноста корисникот може да ја овозможи или оневозможи со посета на делот "Параметри" (Preferences) или “Поставки" (Settings) на интернет пребарувачот кој го користи.
`.trim();
};

const CookiesPolicyPage = ({ store }: { store: Store }) => {
  const { t } = useTranslation("translation");
  const title = t("pages.cookiesPolicy");
  if (!store.company) {
    return (
      <>
        <Head
          url={urls.cookiesPolicy}
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

  const cookiesPolicy = getCookiesPolicy({
    customDomain: store.customDomain,
    slug: store.slug,
    companyName: store.company.companyName,
    registryNumber: store.company.registryNumber,
    taxNumber: store.company.taxNumber,
    companyAddress: store.company.companyAddress,
  });

  return (
    <>
      <Head
        url={urls.cookiesPolicy}
        store={store}
        title={title}
        description={getTextSnippet(cookiesPolicy)}
      />
      <LegalContent
        url={urls.cookiesPolicy}
        title={title}
        body={cookiesPolicy}
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

export default CookiesPolicyPage;
