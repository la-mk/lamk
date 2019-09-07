import { Home } from '../src/components/home/Home';
import { Head } from './common/Head';
import { sdk } from 'la-sdk';
import { NextPageContext } from 'next';

function HomePage({ products }: any) {
  return (
    <>
      <Head title='Home' />
      <Home products={products} />
    </>
  );
}

// See https://nextjs.org/docs#fetching-data-and-component-lifecycle
HomePage.getInitialProps = async (ctx: NextPageContext) => {
  // @ts-ignore
  const store = ctx.store.getState().store;
  try {
    const products = await sdk.product.findForStore(store._id);
    return { products: products.data };
  } catch (err) {
    console.log(err);
  }

  return { products: [] };
};

export default HomePage;
