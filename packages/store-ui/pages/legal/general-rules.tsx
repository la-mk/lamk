import React from 'react';
import { Head } from '../../src/common/pageComponents/Head';
import { useTranslation } from '../../src/common/i18n';
import { LegalContent } from '../../src/components/legal/LegalContent';
import { getStore } from '../../src/state/modules/store/store.selector';
import { Store } from '@sradevski/la-sdk/dist/models/store';
import { NextPageContext } from 'next';

const getGeneralRules = ({
  storeName,
  companyName,
  registryNumber,
  taxNumber,
  companyAddress,
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
  const { t } = useTranslation();
  const title = t('pages.generalRules');
  const generalRules = getGeneralRules({
    storeName: store.name,
    companyName: store.company.companyName,
    registryNumber: store.company.registryNumber,
    taxNumber: store.company.taxNumber,
    companyAddress: store.company.companyAddress,
  });

  return (
    <>
      <Head title={title} />
      <LegalContent title={title} body={generalRules} />
    </>
  );
};

GeneralRulesPage.getInitialProps = async (
  ctx: NextPageContext & { store: any },
) => {
  const store = getStore(ctx.store.getState());
  return { store };
};

export default GeneralRulesPage;
