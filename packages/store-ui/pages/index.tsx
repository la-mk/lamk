import { Home } from '../src/components/home/Home';
import { Head } from '../src/common/pageComponents/Head';
import { sdk } from '@sradevski/la-sdk';
import { NextPageContext } from 'next';
import { getStore } from '../src/state/modules/store/store.selector';
import { setCategoriesIfNone } from '../src/common/initialProps/setCategoriesIfNone';
import { useTranslation } from '../src/common/i18n';
import { StoreContents } from '@sradevski/la-sdk/dist/models/storeContents';
import { Store } from '@sradevski/la-sdk/dist/models/store';

function HomePage({
  store,
  landingContent,
}: {
  store: Store | undefined;
  landingContent: StoreContents['landing'];
}) {
  const { t } = useTranslation();

  return (
    <>
      <Head storeName={store && store.name} title={t('pages.home')} />
      <Home landingContent={landingContent} />
    </>
  );
}

HomePage.getInitialProps = async (ctx: NextPageContext & { store: any }) => {
  const store = getStore(ctx.store.getState());
  try {
    const res = await Promise.all([
      sdk.storeContents.getLandingContentForStore(store?._id),
      setCategoriesIfNone(ctx),
    ]);

    return { store, landingContent: res[0] };
  } catch (err) {
    console.log(err);
  }

  return { store, landingContent: {} };
};

export default HomePage;
