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

const getPrivacyPolicy = ({
  companyName,
  registryNumber,
  taxNumber,
  companyAddress,
  slug,
  customDomain,
  privacyOfficerEmail,
  privacyOfficerPhone,
  privacyOfficerName,
}: {
  companyName: string;
  registryNumber: string;
  taxNumber: string;
  companyAddress: string;
  slug: string;
  customDomain?: string;
  privacyOfficerEmail: string;
  privacyOfficerPhone: string;
  privacyOfficerName: string;
}) => {
  return `
  ## Политика за приватност на личните податоци при посета на интернет страната на ${companyName}
  
  Оваа Политиката за приватност на личните податоци го уредува начинот на кој **${companyName}** ги собира, користи, одржува и открива податоците собрани од корисниците (понатаму: “корисник") при посета на нејзината интернет страната **${slug}.la.mk**${
    customDomain ? `, **${customDomain}**` : ""
  } и поддомените (понатаму: ”интернет страна").

  **${companyName}** е Друштво за производтво, услуги и трговија на големо и мало со Седиште на Ул. ${companyAddress}, со Е.М.Б.С ${registryNumber} и Е.Д.Б ${taxNumber}, (понатаму: „**${companyName}“**)

  Оваа политика за приватност се однесува единствено за наведената интернет страна и не се однесува за личните податоци што **${companyName}** ги собира од своите корисници на други начини. Оваа Политика на приватност не се однесува ниту на лични податоци кои ги собираат други интернет страни, до кои пристапувате преку нашaтa интернет страна.

  ### Процесор за информации (платформа за е-трговија)
  
  Оваа онлајн продавница е направена преку платформата **la.mk**, во сопственост на **Техон Ко ДООЕЛ Битола**, со седишта на ул. Пожаревачка 88 Битола, со Е.М.Б.С 7442556, и Е.Д.Б 4002020560697. Како провајдер на услугите за електронска трговија, и процесор на информациите, **Техон Ко ДООЕЛ Битола** има пристап и исти привилегии до истите информации како и **${companyName}**, опишани понатаму во овој текст.

  ### Кои информации ги собираме?

За време на посетата на интернет страната, Вашата приватност целосно се почитува.
При посета на интернет страната, **${companyName}** ги обработува Вашите лични податоци (лични податоци за идентификација и информации за контакт), само доколку доброволно ги дадете преку регистрирање на нашата интернет страна, заради користење на нашите услуги и производи, електронски нарачки при online продажба, електронско плаќање на производ, наградни игри, анкети.
При електронско плакање на производ, **${companyName}** нема пристап до податоците поврзани со Вашата платежна картичка или сметка во банка, бидејќи тие се испраќаат директно до сертифициран процесинг центар за трансакции со платежни картички и банката преку сигурносна врска.
Трансакцијата при наплаќање на производот е пренасочена и се процесира преку порталот за наплата од кредитни картички на банката. Порталот користи современа заштита на податоците и сите процеси се одвиваат преку сигурна конекција со банката.

Од информациите кои ни се потребни при регистрацијата и/или при нарачка ги издвојуваме:
- име и презиме
- e-mail адреса
- адреса за испорака на нарачката
- телефон за контакт

Малолетни лица не смеат да даваат лични податоци без одобрение од нивните родители или старатели и се обврзуваме дека нема намерно да собираме или користиме податоци од малолетни лица. Ги превземаме сите заштитни мерки за заштита на личните податоци на купувачите со цел да се минимизира ризикот од неовластен пристап и злоупотреба на истите.

**${companyName}** не го обработува единствениот матичен број на граѓанинот (ЕМБГ)
Согласно чл. 9 од Законот за заштита на лините податоци: Матичниот број на граѓанинот може да се обработува само: - по претходна изречна согласност на субјектот на лични податоци; - за остварување на со закон утврдени права или обврски на субјектот на лични податоци или контролорот и - во други случаи утврдени со закон. Контролорот е должен да води сметка матичниот број на граѓанинот да не биде непотребно видлив, печатен или преземен од збирка на лични податоци.


### За кои цели се користат собраните податоци и информации?
**${companyName}** ги обработува Вашите лични податоци за:
- извршување на достава на Вашите порачки преку страната.
- овозможување на online користење на нашите услуги и производи, со намера за подобрување на корисничкото искуство преку унапредување на квалитетот на услугата кон корисниците, односно поефикасно одговарање на Вашите барања и давање на потребната поддршка.
- администрирање на содржината, промоциите, анкетите и други функционалности на страната, а се со цел да го подобриме нејзиниот квалитет и услугите што ги нудиме преку неа.

Вашите лични податоци нема да се обработуваат за ниту една друга цел, освен за целта заради која се собрани. Обработка на Вашите лични податоци за друга цел, може да се врши единствено врз основа на Ваша претходна согласност


### На кој начин се врши обработката на личните податоци?

Обработката на Вашите лични податоци **${companyName}** ја врши согласно прописите за заштита на лични податоци на Република Северна Македонија, преземајќи ги сите пропишани технички и организациони мерки за обезедување на тајност и заштита при обработката на личните податоци со кои располага. 

Вработените во **${companyName}** се обврзани да ги чуваат во тајност сите информации (вклучително и личните податоци), до кои ќе дојдат за време на извршувањето на нивните работни задачи.
**${companyName}** применува сигурносни мерки при прибирање, чување и процесирање на информациите заради заштита од неавторизиран пристап, промена, откривање или уништување на вашите лични податоци, како и податоци што не се лични, а се складирани на нашата страна. Личните податоци може да бидат доставени само на надлежните органи, согласно со законски предвидената постапка.

Согласно чл. 12 од Законот за заштита на личните податоци Субјектот на лични податоци може да побара од контролорот да го информира: - дали се врши обработка на неговите лични податоци; 8 - за целите и правната основа на обработката на личните податоци и корисниците или категориите на корисници на кои им се откриваат личните податоци; - за личните податоци во врска со субјектот на личните податоци и изворот на податоци и - за логиката на автоматизирана обработка, во случај на одлука донесена врз автоматска обработка, која има влијание врз субјектот на лични податоци. Контролорот е должен да одговори на субјектот на лични податоци од ставот 1 на овој член, во рок од 15 дена од денот на приемот на барањето. Кога контролорот одговорил на барањето на субјектот на лични податоци од ставот 1 на овој член, нема обврска повторно да одговори на исто или слично барање на тој субјект, ако во меѓувреме нема промени во неговите лични податоци, освен ако изминале шест месеца од денот на доставувањето на претходното барање до новото барање.

Во секој момент може да извршите промена, ажурирање или корекција на Вашите неточни лични податоци и информации.

### Времетраење на чувањето на податоци

Ги чуваме вашите податоци се додека одредената цел за која е прибавена е задоволена или се додека сме законски обврзани да го правиме тоа. Вашите податоци се чуваат за историски архиви на порачки, но не се употребуваат на ниеден друг начин што не е објаснет во оваа политика за приватност.

### Други информации

Имајќи ја во предвид природата на Интернетот, треба да се напомене дека при неговото користење пасивно и автоматски се собираат податоци за навиките и преференциите на неговите корисници.
При посетата на интернет страната од корисниците, **${companyName}** може да евидентира информации поврзани со нив, кои сами по себе не се доволни за да идентификауваат одредено лице и претставуваат статистички показатели кои се користат заради подобрување на квалитетот на интернет страната. Таквите информации може да ги вклучуваат: името на пребарувачот на интернет, типот на компјутерот, како и технички информации за конекцијата што ја користи корисникот при посетата на интернет страната, како што се оперативен систем и давателот на интернет-услугата, IP (интернет протокол) адреси кои се доделуваат од страна на давателот на интернет-услугата и се различни за секој корисник и слични информации.

**${companyName}** го задржува правото да ги користи IP aдресите и другите податоци на корисниците за откривање на нивниот идентитет во случај на спроведување на законот и законските постапки. Податоците кои ги собираме и се чуваат кај нас, нема да се објавуваат, продаваат или доставуваат на трета страна освен на надлежните органи на начин определен со законските прописи на Република Северна Македонија.

 **${companyName}** го задржува правото да ги користи IP aдресите и другите податоци на корисниците за откривање на нивниот идентитет во случај на спроведување на законот и законските постапки. 

### Офицер за заштита на податоци

За какви било прашања околу политиката за приватност и барања за бришење на вашите лични податоци од нашата страна, можете да се обратите кон офицерот за заштита на лични податоци

Офицер за заштита на лични податоци: **${privacyOfficerName}**

Телефонски број: **${privacyOfficerPhone}**

Електронска пошта: **${privacyOfficerEmail}**

Согласно чл. 16 од Законот за заштита на личните податоци Контролорот нема да постапи по барањето на субјектот на лични податоци согласно со членот 12 од овој закон, кога е овластен согласно со закон и ако личните податоци се обработуваат исклучиво во научно истражување или ако се собрани исклучиво за утврдени статистички цели и се чуваат за период што не го надминува периодот потребен за единствена цел за создавање на статистички податоци.

### Прифаќање на условите

Со продолжување на пристапот и користењето на оваа интернет страна, корисникот ги прифаќа одредбите од оваа Политика за приватност. Доколку не се согласувате со оваа Политика за приватност, ве молиме да го прекинете пристапот до интернет страната.

### Промени во политиката за приватност на личните податоци

**${companyName}** има право да ја ажурира оваа политика за приватност на личните податоци во кое било време. Кога ќе го направиме тоа, ќе дадеме известување на интернет страната и ќе го ревидираме датумот на ажурирање на крајот на овој документ. Корисникот се согласува дека е негова одговорност периодично да ја проверува Политиката за приватност и дека е свесен за промените.

Промените во политиката на приватност ќе бидат јавно објавени на интернет страната најмалку 10 дена пред да стапат во сила.

Датум на ажурирање: **16.05.2021**
`.trim();
};

const PrivacyPage = ({ store }: { store: Store }) => {
  const { t } = useTranslation("translation");
  const title = t("pages.privacy");
  if (!store.company) {
    return (
      <>
        <Head
          url={urls.privacyPolicy}
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

  const privacyPolicy = getPrivacyPolicy({
    customDomain: store.customDomain,
    slug: store.slug,
    companyName: store.company.companyName,
    registryNumber: store.company.registryNumber,
    taxNumber: store.company.taxNumber,
    companyAddress: store.company.companyAddress,
    privacyOfficerEmail: "contact@la.mk",
    privacyOfficerPhone: "075 212 495",
    privacyOfficerName: "Стевче Радевски",
  });

  return (
    <>
      <Head
        url={urls.privacyPolicy}
        store={store}
        title={title}
        description={getTextSnippet(privacyPolicy)}
      />
      <LegalContent
        url={urls.privacyPolicy}
        title={title}
        body={privacyPolicy}
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

export default PrivacyPage;
