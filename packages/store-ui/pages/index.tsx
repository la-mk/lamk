import { Home } from '../src/components/home/Home';
import { Head } from '../src/common/pageComponents/Head';
import { NextPageContext } from 'next';
import { getStore } from '../src/state/modules/store/store.selector';
import { useTranslation } from '../src/common/i18n';
import { Store } from '@la-mk/la-sdk/dist/models/store';

function HomePage({ store }: { store: Store | undefined }) {
  const { t } = useTranslation();

  return (
    <>
      <Head
        siteName={store?.name}
        title={t('pages.home')}
        description={
          store?.slogan ??
          `${store?.name} - ${t('seoDescriptions.storeGeneric')}`
        }
      />
      <Home />
    </>
  );
}

HomePage.getInitialProps = async (ctx: NextPageContext & { store: any }) => {
  const store = getStore(ctx.store.getState());
  return { store };
};

export default HomePage;
