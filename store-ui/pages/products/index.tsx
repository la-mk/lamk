import { sdk } from 'la-sdk';
import { Product } from 'la-sdk/dist/models/product';
import { Head } from '../common/Head';
import { Products } from '../../src/products/Products';

function ProductsPage({ products }: { products: Product[] }) {
  return (
    <>
      <Head title='Products' />
      <Products products={products} />
    </>
  );
}

ProductsPage.getInitialProps = async ({ req }) => {
  const res = await sdk.product.find();
  return { products: res.data };
};

export default ProductsPage;
