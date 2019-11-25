import { Home } from '../src/components/home/Home';
import { Head } from './common/Head';
import { sdk } from '@lamk/la-sdk';
import { NextPageContext } from 'next';
import { getStore } from '../src/state/modules/store/store.selector';
import { setCategoriesIfNone } from './common/initialProps/setCategoriesIfNone';
import { useTranslation } from '../src/common/i18n';
import { Product } from '@lamk/la-sdk/dist/models/product';
import { StoreContents } from '@lamk/la-sdk/dist/models/storeContents';

function HomePage({
  products,
  landingContent,
}: {
  products: Product[];
  landingContent: StoreContents['landing'];
}) {
  const { t } = useTranslation();

  return (
    <>
      <Head title={t('pages.home')} />
      <Home products={products} landingContent={landingContent} />
    </>
  );
}

HomePage.getInitialProps = async (ctx: NextPageContext & { store: any }) => {
  const store = getStore(ctx.store.getState());
  try {
    const res = await Promise.all([
      sdk.product.findForStore(store._id),
      sdk.storeContents.getLandingContentForStore(store._id),
      setCategoriesIfNone(ctx),
    ]);

    return { products: res[0].data, landingContent: res[1] };
  } catch (err) {
    console.log(err);
  }

  return { products: [], landingContent: {} };
};

export default HomePage;
