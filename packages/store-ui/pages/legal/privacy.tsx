import React from 'react';
import { Head } from '../../src/common/pageComponents/Head';
import { useTranslation } from '../../src/common/i18n';
import { LegalContent } from '../../src/components/legal/LegalContent';
import { getStore } from '../../src/state/modules/store/store.selector';
import { Store } from '@sradevski/la-sdk/dist/models/store';
import { NextPageContext } from 'next';
import { getTextSnippet } from '../../src/common/utils';
import { Empty } from '@sradevski/blocks-ui';

const getPrivacyPolicy = ({
  companyName,
  registryNumber,
  taxNumber,
  companyAddress,
}) => {
  return `
Со Политикатата на приватност, ќе ви појасниме каде и како се чуваат личните податоци на сите регистрирани купувачи на нашата интернет страна. Оваа политика на приватност се однесува само за agnesa.mk и agnesa.la.mk и поддомените. Доколку е присутен линк кој ќе Ве поврзе со други страни, ние не превземаме никаква одговорност во однос на заштитата на личните податоци која ја обезбедуваат тие интернет страни. 

Секој корисник при регистрација и купување, изјавува дека е запознаен и се согласува со нашата Политика на приватност. 

Доколку се регистрирате, сите лични податоци кои ќе ги внесете преку формата за регистрација, ќе се користат за потребите за достава на производот, реализација на плаќањето, како и за рекламирање на производи и услуги обезбедени од наша страна, доколку ја имате избрано оваа опција, а се чуваат согласно одредбите од Законот за заштита на лични податоци и не се отстапуваат на трети страни. 

Од информациите кои ни се потребни при регистрацијата и/или при нарачка ги издвојуваме:
Име и презиме
e-mail адреса
Адреса за испорака на нарачката и
телефон за контакт.

Податоците кои ги собираме и се чуваат кај нас, нема да се објавуваат, продаваат или доставуваат на трета страна освен на надлежните органи на начин определен со законските прописи на Република Северна Македонија. Друштво за производство, услуги и трговија на големо и мало ${companyName} со седиште: ${companyAddress} и Е.М.Б.С ,${registryNumber} Е.Д.Б ${taxNumber} го задржува правото да ги користи IP aдресите и другите податоци на корисниците за откривање на нивниот идентитет во случај на спроведување на законот и законските постапки. 

Во секој момент може да извршите промена, ажурирање или корекција на Вашите неточни лични податоци и информации.

${companyName} има усвоена политика за сигурност и заштита на податоци, со што ја демонстрира посветеноста на нашата фирма кон заштитата на приватноста на клиентите. Со исклучок на податоците од финансиска природа, сите информации кои ги собираме од веб страната се исклучиво за наша употреба (релација со корисници, следење на нарачка итн.) и истите не се предаваат на други лица за било каков основ. Не собираме никакви информации од финансиска природа, како број на картичка и сл. Податоците околу кредитната картичка и банкарската сметка ќе бидат чувани и користени исклучиво од страна на банката со цел наплата на продуктите/нарачките преку извршување на  трансакција. Трансакцијата при наплаќање на производот е пренасочена и се процесира преку порталот за наплата од кредитни картички на банката. Порталот користи современа заштита на податоците и сите процеси се одвиваат преку сигурна конекција со банката.

Малолетни лица не смеат да даваат лични податоци без одобрение од нивните родители или старатели и се обврзуваме дека нема намерно да собираме или користиме податоци од малолетни лица. Ги превземаме сите заштитни мерки за заштита на личните податоци на купувачите со цел да се минимизира ризикот од неовластен пристап и злоупотреба на истите. 

Оваа политика на приватност стапува на сила од Јануари 2020 година. Промените во политиката на приватност ќе бидат јавно објавени на интернет странатa agnesa.mk и agnesa.la.mk најмалку 10 дена пред да стапат во сила.

- Заштита на лични податоци 
- Барање за доставување на информации за обработка на личните податоци 
- Барање за дополнување, измена или бришење на податоците 
- Барање за запирање на обработката на личните податоци
`.trim();
};

const PrivacyPage = ({ store }: { store: Store }) => {
  const { t } = useTranslation();
  const title = t('pages.privacy');
  if (!store.company) {
    return (
      <>
        <Head siteName={store?.name} title={title} description={title} />
        <Empty mt={6} description={t('legal.legalNotAvailable')} />
      </>
    );
  }

  const privacyPolicy = getPrivacyPolicy({
    companyName: store.company.companyName,
    registryNumber: store.company.registryNumber,
    taxNumber: store.company.taxNumber,
    companyAddress: store.company.companyAddress,
  });

  return (
    <>
      <Head
        siteName={store?.name}
        title={title}
        description={getTextSnippet(privacyPolicy)}
      />
      <LegalContent url='/legal/privacy' title={title} body={privacyPolicy} />
    </>
  );
};

PrivacyPage.getInitialProps = async (ctx: NextPageContext & { store: any }) => {
  const store = getStore(ctx.store.getState());
  return { store };
};

export default PrivacyPage;
