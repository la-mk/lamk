import { Home } from '../src/home/Home';
import { Head } from './common/Head';
import { sdk } from 'la-sdk';

function HomePage({ products }: any) {
  return (
    <>
      <Head title='Home' />
      <Home products={products} />
    </>
  );
}

// See https://nextjs.org/docs#fetching-data-and-component-lifecycle
HomePage.getInitialProps = async () => {
  const store = { _id: '5d28c8c843ab4c4b7c0ad68e' };
  if (store._id) {
    try {
      const products = await sdk.product.findForStore(store._id);
      return { products: products.data };
    } catch (err) {
      console.log(err);
    }
  }

  return { products: [] };
};

export default HomePage;
