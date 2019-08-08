import Head from "next/head";
import Link from 'next/link';
import { Layout } from "../src/Layout";

function Home({stars}: any) {
  return (
    <div>
      <Head>
        <title key="title">My page title</title>
        <meta key="viewport" name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Layout>
        <div>Welcome to Next.js! {stars}</div>
        <Link href="/products?category=home-items"><a>Products</a></Link>
      </Layout>
    </div>
  );
}

// See https://nextjs.org/docs#fetching-data-and-component-lifecycle
Home.getInitialProps = async () => {
  // This won't work, as fetch needs to be available in both node and browsers
  // const res = await fetch('https://api.github.com/repos/zeit/next.js');
  // const json = await res.json();
  // return { stars: json.stargazers_count };
  return {stars: 1};
};

export default Home;
