import { Head } from '../../src/common/pageComponents/Head';
import { useTranslation } from '../../src/common/i18n';
import { getStore } from '../../src/state/modules/store/store.selector';
import { NextPageContext } from 'next';
import { Store } from '@sradevski/la-sdk/dist/models/store';
import { Legal } from '../../src/components/legal/Legal';

function LegalPage({ store }: { store: Store | undefined }) {
  const { t } = useTranslation();
  return (
    <>
      <Head
        siteName={store?.name}
        title={t('pages.legal')}
        description={`${t('pages.legal')}, ${store?.name}`}
      />
      <Legal />
    </>
  );
}

LegalPage.getInitialProps = async (ctx: NextPageContext & { store: any }) => {
  try {
    const state = ctx.store.getState();
    const store = getStore(state);
    if (!store) {
      return {};
    }

    return { store };
  } catch (err) {
    console.log(err);
  }

  return {};
};

export default LegalPage;
