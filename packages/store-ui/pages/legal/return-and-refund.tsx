import React from 'react';
import { Head } from '../../src/common/pageComponents/Head';
import { useTranslation } from '../../src/common/i18n';
import { LegalContent } from '../../src/components/legal/LegalContent';
import { getStore } from '../../src/state/modules/store/store.selector';
import { Store } from '@sradevski/la-sdk/dist/models/store';
import { NextPageContext } from 'next';
import { getTextSnippet } from '../../src/common/utils';

const getReturnAndRefundPolicy = ({ storeName }) => {
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
  const { t } = useTranslation();
  const title = t('pages.returnAndRefund');
  const returnAndRefundPolicy = getReturnAndRefundPolicy({
    storeName: store.name,
  });

  return (
    <>
      <Head
        siteName={store?.name}
        title={title}
        description={getTextSnippet(returnAndRefundPolicy)}
      />
      <LegalContent title={title} body={returnAndRefundPolicy} />
    </>
  );
};

ReturnAndRefundPage.getInitialProps = async (
  ctx: NextPageContext & { store: any },
) => {
  const store = getStore(ctx.store.getState());
  return { store };
};

export default ReturnAndRefundPage;
