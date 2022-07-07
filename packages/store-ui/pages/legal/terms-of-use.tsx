import React from "react";
import { Result } from "@la-mk/blocks-ui";
import { getStore, PageContextWithStore } from "../../hacks/store";
import { getProps, newClient } from "../../sdk/queryClient";
import { getDefaultPrefetch } from "../../sdk/defaults";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { Store } from "../../domain/store";
import { Head } from "../../layout/Head";
import { getTextSnippet } from "../../tooling/text";
import { LegalContent } from "../../pageComponents/legal/LegalContent";
import { urls } from "../../tooling/url";

const getTermsOfUse = ({
  storeName,
  companyName,
  registryNumber,
  taxNumber,
  companyAddress,
  slug,
  customDomain,
}: {
  storeName: string;
  companyName: string;
  registryNumber: string;
  taxNumber: string;
  companyAddress: string;
  slug: string;
  customDomain?: string;
}) => {
  return `
# Термини и услови:
Оваа интернет страна, со домеин ${slug}.la.mk, ${
    customDomain ?? ""
  } во сопственост на Друштво за производтво, услуги и трговија на големо и мало ${companyName} со седиште: ${companyAddress} и Е.М.Б.С ${registryNumber}, Е.Д.Б ${taxNumber}, е сервис создаден за корисниците со цел да овозможи пребарување, споредба и/или купување на производи и услуги. Како посетител и корисник, Ви даваме до знаење дека употребата на содржините на страната, како и направените трансакции, се предмет на одредени услови и правила, за што Ве замолуваме пред користење на страната ${slug}.la.mk, ${
    customDomain ?? ""
  } внимателно да ги прочитате. ${companyName} не превзема никаква одговорност доколку корисникот ги нема прочитано условите и правилата за користење и купување.


# Општи услови:
Со самата посета или купување преку нашата интернет страна, потребно е да се согласите со условите наведени подолу, чие право на промена во зависност од условите и потребите е задржано без претходно известување на корисниците на сајтот. ${companyName} не превзема одговорност доколку корисникот на сајтот не ги прочитал јавно достапните информации и услови од овој сајт. Ако не се согласувате со Општите услови на оваа страна, едноставно не ја користете и повелете во некоја од нашите ${storeName} Продавници.

Називот е заштитен трговски знак на ${companyName} и забранет е секаков вид на негова употреба без претходна писмена согласност на сопственикот. ${companyName} ги задржува сите права кои произлегуваат од трговскиот знак ${storeName}. Целата содржина на оваа страна, вклучувајќи ја формата, изгледот, сликите, информациите, дизајнот и сите достапни податоци, се интелектуална сопственост на ${companyName} и се заштитени со авторско право и сродните права. Превземањето на информации, податоци и слики, нивна дистрибуција, пренос или користење на линкот од овој сајт е забрането. Употребата на истите е можна само за некомерцијални цели и лична употреба надвор од дозволеноста за било каква злоупотребата на податоците и опциите кои ги нуди оваа страна. Споделените информации од оваа страна имаат информативен карактер. Секогаш ќе се залагаме за точност на информациите, но можни се отстапувања и пропусти во информирањето, во зависност од изворот на информациите.За сите производи ќе се потрудиме да имате достапна фотографија, како илустрација за изгледот и формата на производот.

${storeName} го задржува правото да објавува називи, модели и други информации за производот на англиски јазик, кога:
- Постои ризик од губење на битни информации при преводот
- Нема иста или слична терминологија на македонски јазик

Како би ги задоволиле Вашите потреби и барања, ${storeName} ќе се залага за достапност на својата интернет страна 24 часа во денот. Во случај на привремена недостапност односно прекин на пристапот до интернет страната поради технички или надворешни влијанија надвор од контролата на ${storeName}, не можеме да превземеме никаква одговорност и да Ви гарантираме постојан пристап.


# Политика на приватност:
Со Политикатата на приватност, ќе ви појасниме каде и како се чуваат личните податоци на сите регистрирани купувачи на нашата интернет страна. Оваа политика на приватност се однесува само за ${slug}.la.mk, ${
    customDomain ?? ""
  } и поддомените. Доколку е присутен линк кој ќе Ве поврзе со други страни, ние не превземаме никаква одговорност во однос на заштитата на личните податоци која ја обезбедуваат тие интернет страни.

Секој корисник при регистрација и купување, изјавува дека е запознаен и се согласува со нашата Политика на приватност. Доколку се регистрирате, сите лични податоци кои ќе ги внесете преку формата за регистрација, ќе се користат за потребите за достава на производот, реализација на плаќањето, како и за рекламирање на производи и услуги обезбедени од наша страна, доколку ја имате избрано оваа опција, а се чуваат согласно одредбите од Законот за заштита на лични податоци и не се отстапуваат на трети страни.
Од информациите кои ни се потребни при регистрацијата и/или при нарачка ги издвојуваме:
- Име и презиме
- e-mail адреса
- Адреса за испорака на нарачката
- телефон за контакт.

Податоците кои ги собираме и се чуваат кај нас, нема да се објавуваат, продаваат или доставуваат на трета страна освен на надлежните органи на начин определен со законските прописи на Република Македонија. ${storeName} го задржува правото да ги користи IP aдресите и другите податоци на корисниците за откривање на нивниот идентитет во случај на спроведување на законот и законските постапки. Во секој момент може да извршите промена, ажурирање или корекција на Вашите неточни лични податоци и информации.

${companyName} има усвоена политика за сигурност и заштита на податоци, со што ја демонстрира посветеноста на нашата фирма кон заштитата на приватноста на клиентите. Со исклучок на податоците од финансиска природа, сите информации кои ги собираме од веб страната се исклучиво за наша употреба (релација со корисници, следење на нарачка итн.) и истите не се предаваат на други лица за било каков основ. Не собираме никакви информации од финансиска природа, како број на картичка и сл. Податоците околу кредитната картичка и банкарската сметка ќе бидат чувани и користени исклучиво од страна на банката со цел наплата на продуктите/нарачките преку извршување на трансакција. Трансакцијата при наплаќање на производот е пренасочена и се процесира преку порталот за наплата од кредитни картички на банката. Порталот користи современа заштита на податоците и сите процеси се одвиваат преку сигурна конекција со банката. Малолетни лица не смеат да даваат лични податоци без одобрение од нивните родители или старатели и се обврзуваме дека нема намерно да собираме или користиме податоци од малолетни лица. Ги превземаме сите заштитни мерки за заштита на личните податоци на купувачите со цел да се минимизира ризикот од неовластен пристап и злоупотреба на истите. Оваа политика на приватност стапува на сила од Јануари 2020 година. Промените во политиката на приватност ќе бидат јавно објавени на интернет странатa ${slug}.la.mk, ${
    customDomain ?? ""
  } најмалку 10 дена пред да стапат во сила.


# Услови и правила за купување:
Цените на сите производи на ${slug}.la.mk, ${
    customDomain ?? ""
  } се изразени во денари со вклучен ДДВ. ${companyName} го задржува правото за промена на цените, во согласност со политиката на компанијата, без известување за корисниците. Корекција на цената нема да биде извршена ако нарачката е прифатена. Купувачот се обврзува да ја плати цената, која е понудена во моментот на извршување на нарачката, независно од фактот што цената може да биде променета во меѓувреме. За купување на производи преку ${slug}.la.mk, ${
    customDomain ?? ""
  } важат редовните малопродажни цени. Сите попусти, промоции и специјални промотивни пакет производи кои не се изразени на онлајн продавницата, важат искучиво за извршено купување во малопродажните објекти на ${storeName}.

Количините на производите се ограничени. Согласно тоа, одредена нарачка може да биде откажана поради исцрпување на залихите.
Купувачот може да избере еден или повеќе производи, како и пакет на производи од понудата на ${storeName}. Купувачот може да ја откаже, нарачката во било кое време, пред да го реализира плаќањето. Регистрирањето е задолжително за реализацијата на нарачката, и при нарачката, задолжителни се податоците за контакт, како и адреса за испорака. По завршувањето на нарачката ќе Ви биде испратен e-mail на адресата која ја имате наведено, за потврда на нарачката. При евентуални технички проблеми со интернет страната, ${storeName} има право да ја одбие нарачката или да го прекине процесот на купување, и не сме обврзани да извршиме никакво обесштетување, освен враќање на уплатените средства од страна на купувачот.


# Подршка на корисници:
За било какви информации и прашања во врска со реализацијата на интернет продажба може да се јавите на наведените телефонски броеви кои сее достапни во периодот од 09:00 часот до 17:00 часот или да не контактирате 24/7 преку нашиот e-mail.


# Политика на испорака на производи:
Купувањето преку нашата интернет страница може да ја реализирате од било кој дел на светот, но испораката може да ја спроведеме само на територијата на Република Северна Македонија. Сите производи ќе Ви бидат доставени на адресата за испорака која задолжително треба да ја доставите при креирање на нарачката. Можете и да ги изненадите Вашите блиски и да побарате достава на нивна адреса, при тоа наведувајќи ја нивната адреса како адреса за испорака. 
Периодот за испорака е во зависност од локацијата за испорака. Предвидено време за испорака е 72 часа од поставувањето на нарачката. Во согласност со нашите можности, призводот ќе Ви биде доставен во најкус можен рок. ${companyName} го задржува правото да го продолжи рокот на испорака во претходен договор со купувачот. Испораката се врши преку нашата служба за испорака или преку надворешни соработници. Испорака во сабота по 15 часот, во недела и на државни празници не се врши. Пред испораката на производот купувачот ќе биде телефонски контактиран, на телефонскиот број оставен за контакт, за потврдување на датумот и времето на испораката. Доколку нарачката е направена по 17 часот, истата ќе биде проверена од наша страна наредниот работен ден, и откако ќе се добие потврда за успешната трансакција, започнува да тече периодот за испорака. Доколку нарачката е направена во петок по 16 часот, сабота, недела или во неработен ден, оваа процедура започнува од првиот нареден работен ден. Во рокот на испорака не се пресметуваат викендите и неработните денови.

Испораката на производот се врши на наведената адреса за испорака од страна на купувачот. Секој купувач е должен при превземање на производот, да го провери од евентуални оштетувања при транспорт, а доколку се работи за повеќе производи, да провери дали некој производ недостасува. Доколку производот е испорачан оштетен, или одреден производ недостасува од нарачката, купувачот треба да не информира веднаш, како би превземале мерки за отстранување на ненамерната грешка. Во овој случај, трошоците за замена на производот нема да бидат на товар на купувачот.

Во случај купувачот да сака да го врати производот, не по наша вина или вина на доставувачот, и сака да му се врати уплатената сума на производот, тогаш од крајниот износ ќе биде одбиен трошокот за транспорт. Доколку купувачот сака да го замени производот, должен е да го чува неоштетен, неотпакуван и неупотребуван заедно со сите приложени документи. Доколку има доцнење на испораката од страна на компанијата која е ангажирана за извршување на испораката, ${companyName} не може да превземе никаква одговорност.


# Прием на производи:
Производот/ите се доставуваат до влезната врата на куќата односно до влезот на станбена зграда. Производот/ите се спакувани во соодветни кутии, како заштита од евентуални оштетувања и се осигурани од губење или оштетување за време на транспортот. Во моментот на прием на производот/ите, должни сте истите да ги прегледате и веднаш да приговорите за евентувални надворешни оштетувања на производот/ите. Евентуалниот приговор треба да биде упатен на телефонскиот број за подршка на корисници и кај лицето кое ја врши испораката, во спротивно сите подоцнежни рекламации во однос на надворешни оштетувања на производот/ите нема да бидат прифатени. Заедно со приемот на производот/ите задолжително добивате и пропратна документација која се состои од: упатство за употреба, гарантен лист, фактура-испратница, која сте должни да ја потпишете.


# Враќање и замена на производи:
Купувачот има право да врати купен производ во период од 7 дена од датумот на испорака, под услов производот кој се враќа да е во иста физичка состојба во која е испорачан, неотпакуван и неупотребуван, со сите етикети и ознаки кои ги имал при приемот. Средствата ќе ви бидат вратени при предавање на производот преку нас или преку надворешни соработници. Според Законот за заштита на потрошувачите, купувачот има право да го замени производот што има соодветен квалитет, а што не одговара во однос на формата, големината, моделот, бојата или бројот. Потрошувачот правото може да го оствари во рок од 15 дена од денот кога производот е купен. Замена на производот со соодветен квалитет се врши ако производот не бил употребуван, ако е сочуван изгледот на производот, употребните својства, пломбите, фабричките етикети, како и фискалната сметка или фактура-испратница кои на потрошувачот му биле издадени заедно со производот. Ако во моментот на поднесувањето на барањето од потрошувачот трговецот нема соодветен производ (производ што ќе одговара на неговите потреби), потрошувачот има право по свој избор да бара да го раскине договорот и да бара враќање на платениот паричен износ.


# Гаранција:
Секој производ, купен преку интернет страната на ${companyName}, има соодветен гарантен лист и гарантен рок одреден од производителот. Гарантниот лист содржи гарантна изјава и гарантни услови кои се обврзувачки за полноважноста на гаранцијата на производот. Гаранцијата нема да важи доколку:
- Не се достапни гарантниот лист или доказот за купување (фискална сметка или Фактура-испратница)
- Има обиди за поправка на производот од неовластени сервиси
- Има оштетувања или дефекти настанати при неправилна употреба на производот
- Има физички оштетувања на производот
- Гаранцијата на производот не ги покрива додатоците и компонентите кои имаат ограничен рок на траење.
<br>
КУПУВАЧОТ Е ЗАПОЗНАЕН И СОГЛАСЕН СО УСЛОВИТЕ И ПРАВИЛАТА ЗА КОРИСТЕЊЕ НА ИНТЕРНЕТ СТРАНАТА НА ${companyName}, И СЕ ОБВРЗУВА ДА ГИ ПОЧИТУВА ВО ЦЕЛОСТ.  
`.trim();
};

const TermsOfUsePage = ({ store }: { store: Store }) => {
  const { t } = useTranslation("translation");
  const title = t("pages.termsOfUse");
  if (!store.company) {
    return (
      <>
        <Head
          url={urls.termsOfUse}
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

  const termsOfUse = getTermsOfUse({
    customDomain: store.customDomain,
    slug: store.slug,
    storeName: store.name,
    companyName: store.company.companyName,
    registryNumber: store.company.registryNumber,
    taxNumber: store.company.taxNumber,
    companyAddress: store.company.companyAddress,
  });

  return (
    <>
      <Head
        url={urls.termsOfUse}
        store={store}
        title={title}
        description={getTextSnippet(termsOfUse)}
      />
      <LegalContent url={urls.termsOfUse} title={title} body={termsOfUse} />
    </>
  );
};

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

export default TermsOfUsePage;
