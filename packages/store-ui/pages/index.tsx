import { Home } from '../src/components/home/Home';
import { Head } from './common/Head';
import { sdk } from '@lamk/la-sdk';
import { NextPageContext } from 'next';
import { getStore } from '../src/state/modules/store/store.selector';
import { setCategoriesIfNone } from './common/initialProps/setCategoriesIfNone';

function HomePage({ products }: any) {
  return (
    <>
      <Head title='Home' />
      <Home products={products} />
    </>
  );
}

HomePage.getInitialProps = async (ctx: NextPageContext & { store: any }) => {
  const store = getStore(ctx.store.getState());
  try {
    const res = await Promise.all([
      sdk.product.findForStore(store._id),
      setCategoriesIfNone(ctx),
    ]);

    return { products: res[0].data };
  } catch (err) {
    console.log(err);
  }

  return { products: [] };
};

export default HomePage;
