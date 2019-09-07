import { sdk } from 'la-sdk';
import { Product } from 'la-sdk/dist/models/product';
import { Head } from '../common/Head';
import { Products } from '../../src/components/products/Products';
import { NextPageContext } from 'next';

function ProductsPage({ products }: { products: Product[] }) {
  return (
    <>
      <Head title='Products' />
      <Products products={products} />
    </>
  );
}

ProductsPage.getInitialProps = async (
  ctx: NextPageContext & { store: any },
) => {
  const store = ctx.store.getState().store;
  if (store) {
    try {
      const products = await sdk.product.findForStore(store._id);
      return { products: products.data };
    } catch (err) {
      console.log(err);
    }
  }

  return { products: [] };
};

export default ProductsPage;
