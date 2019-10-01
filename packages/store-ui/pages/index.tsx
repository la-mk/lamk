import { Home } from '../src/components/home/Home';
import { Head } from './common/Head';
import { sdk } from 'la-sdk';
import { NextPageContext } from 'next';
import { getStore } from '../src/state/modules/store/store.selector';

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
    const products = await sdk.product.findForStore(store._id);
    return { products: products.data };
  } catch (err) {
    console.log(err);
  }

  return { products: [] };
};

export default HomePage;
