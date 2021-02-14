import React from 'react';
import { useTranslation } from '../../src/common/i18n';
import { Head } from '../../src/common/Head';
import { Legal } from '../../src/common/Legal';

const getTermsOfUse = ({
  storeName,
  companyName,
  registryNumber,
  taxNumber,
  companyAddress,
  slug,
  customDomain,
}) => {
  return `
# Термини и услови:
Оваа интернет страна, со домен ${slug}.la.mk, ${
    customDomain ?? ''
  } во сопственост на Друштво за производство,трговија и услуги ${companyName} со седиште: ${companyAddress} и Е.М.Б.С ${registryNumber}, Е.Д.Б ${taxNumber}, е сервис создаден за корисниците со цел да овозможи креирање на интернет продавници. Како посетител и корисник, Ви даваме до знаење дека употребата на содржините на страната, како и направените трансакции, се предмет на одредени услови и правила, за што Ве замолуваме пред користење на страната ${slug}.la.mk, ${
    customDomain ?? ''
  } внимателно да ги прочитате. ${companyName} не превзема никаква одговорност доколку корисникот ги нема прочитано условите и правилата за користење.

# Општи услови:
Со самата посета или купување преку нашата интернет страна, потребно е да се согласите со условите наведени подолу, чие право на промена во зависност од условите и потребите е задржано без претходно известување на корисниците на сајтот. ${companyName} не превзема одговорност доколку корисникот на сајтот не ги прочитал јавно достапните информации и услови од овој сајт. Ако не се согласувате со Општите услови на оваа страна, едноставно не ја користете.

Називот е заштитен трговски знак на ${companyName} и забранет е секаков вид на негова употреба без претходна писмена согласност на сопственикот. ${companyName} ги задржува сите права кои произлегуваат од трговскиот знак ${storeName}. Целата содржина на оваа страна, вклучувајќи ја формата, изгледот, сликите, информациите, дизајнот и сите достапни податоци, се интелектуална сопственост на ${companyName} и се заштитени со авторско право и сродните права. Превземањето на информации, податоци и слики, нивна дистрибуција, пренос или користење на линкот од овој сајт е забрането. Употребата на истите е можна само за некомерцијални цели и лична употреба надвор од дозволеноста за било каква злоупотребата на податоците и опциите кои ги нуди оваа страна. Споделените информации од оваа страна имаат информативен карактер. Секогаш ќе се залагаме за точност на информациите, но можни се отстапувања и пропусти во информирањето, во зависност од изворот на информациите.

${storeName} го задржува правото да објавува називи, модели и други информации за производот на англиски јазик, кога:
- Постои ризик од губење на битни информации при преводот
- Нема иста или слична терминологија на македонски јазик

Како би ги задоволиле Вашите потреби и барања, ${storeName} ќе се залага за достапност на својата интернет страна 24 часа во денот. Во случај на привремена недостапност односно прекин на пристапот до интернет страната поради технички или надворешни влијанија надвор од контролата на ${storeName}, не можеме да превземеме никаква одговорност и да Ви гарантираме постојан пристап.

# Политика на приватност:
Со Политикатата на приватност, ќе ви појасниме каде и како се чуваат личните податоци на сите регистрирани купувачи на нашата интернет страна. Оваа политика на приватност се однесува само за ${slug}.la.mk, ${
    customDomain ?? ''
  } и поддомените. Доколку е присутен линк кој ќе Ве поврзе со други страни, ние не превземаме никаква одговорност во однос на заштитата на личните податоци која ја обезбедуваат тие интернет страни.

Секој корисник при регистрација и купување, изјавува дека е запознаен и се согласува со нашата Политика на приватност. Доколку се регистрирате, сите лични податоци кои ќе ги внесете преку формата за регистрација, ќе се користат за потребите за контактирање со клиентите, како и за рекламирање на производи и услуги обезбедени од наша страна, доколку ја имате избрано оваа опција, а се чуваат согласно одредбите од Законот за заштита на лични податоци и не се отстапуваат на трети страни.
Од информациите кои ни се потребни при регистрацијата и/или при нарачка ги издвојуваме:
- име и презиме
- e-mail адреса и
- телефон за контакт.

Податоците кои ги собираме и се чуваат кај нас, нема да се објавуваат, продаваат или доставуваат на трета страна освен на надлежните органи на начин определен со законските прописи на Република Македонија. ${storeName} го задржува правото да ги користи IP aдресите и другите податоци на корисниците за откривање на нивниот идентитет во случај на спроведување на законот и законските постапки. Во секој момент може да извршите промена, ажурирање или корекција на Вашите неточни лични податоци и информации.

${companyName} има усвоена политика за сигурност и заштита на податоци, со што ја демонстрира посветеноста на нашата фирма кон заштитата на приватноста на клиентите. Со исклучок на податоците од финансиска природа, сите информации кои ги собираме од веб страната се исклучиво за наша употреба (релација со корисници, следење на нарачка итн.) и истите не се предаваат на други лица за било каков основ. Не собираме никакви информации од финансиска природа, како број на картичка и сл. Податоците околу кредитната картичка и банкарската сметка ќе бидат чувани и користени исклучиво од страна на банката со цел наплата на продуктите/нарачките преку извршување на трансакција. Трансакцијата при наплаќање на производот е пренасочена и се процесира преку порталот за наплата од кредитни картички на банката. Порталот користи современа заштита на податоците и сите процеси се одвиваат преку сигурна конекција со банката. Малолетни лица не смеат да даваат лични податоци без одобрение од нивните родители или старатели и се обврзуваме дека нема намерно да собираме или користиме податоци од малолетни лица. Ги превземаме сите заштитни мерки за заштита на личните податоци на купувачите со цел да се минимизира ризикот од неовластен пристап и злоупотреба на истите. Оваа политика на приватност стапува на сила од Август 2020 година. Промените во политиката на приватност ќе бидат јавно објавени на интернет странатa ${slug}.la.mk, ${
    customDomain ?? ''
  } најмалку 10 дена пред да стапат во сила.

# Подршка на корисници:
За било какви информации и прашања во врска со реализацијата на интернет продажба може да се јавите на наведените телефонски броеви кои сее достапни во периодот од 09:00 часот до 17:00 часот или да не контактирате 24/7 преку нашиот e-mail.

КУПУВАЧОТ Е ЗАПОЗНАЕН И СОГЛАСЕН СО УСЛОВИТЕ И ПРАВИЛАТА ЗА КОРИСТЕЊЕ НА ИНТЕРНЕТ СТРАНАТА НА ${companyName}, И СЕ ОБВРЗУВА ДА ГИ ПОЧИТУВА ВО ЦЕЛОСТ.  
`.trim();
};

const TermsOfUsePage = () => {
  const { t } = useTranslation();
  const title = t('pages.termsOfUse');

  const termsOfUse = getTermsOfUse({
    customDomain: 'la.mk',
    slug: '*',
    storeName: 'la.mk',
    companyName: 'Техон Ко Дооел',
    registryNumber: '7442556',
    taxNumber: '4002020560697',
    companyAddress: 'Пожаревачка 88, Битола',
  });

  return (
    <>
      <Head
        url={'/legal/terms-of-use'}
        title={title}
        description={termsOfUse.split('\n')[0]}
      />
      <Legal title={title} content={termsOfUse} />
    </>
  );
};

export default TermsOfUsePage;
