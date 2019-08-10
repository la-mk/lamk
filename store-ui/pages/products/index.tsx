import Link from 'next/link';
import Head from 'next/head';
import { sdk } from 'la-sdk';
import { Product } from 'la-sdk/dist/models/product';
import { useRouter } from 'next/router';

function Products({products}: {products: Product[]}) {
  const {query} = useRouter();

  return <div>
    <Head>
      <title key="title">Products</title>
      <meta name="viewport" key="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>    
      <h1>
        {query.category}
      </h1>
      {products.map(product => {
        return <Link href="/products/[pid]" as={`/products/${product._id}`}><a>{product.name}</a></Link>
      })}
  </div>;
}

Products.getInitialProps = async ({ req }) => {
  const res = await sdk.product.find();
  return { products: res.data };
};

export default Products;