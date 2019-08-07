import Head from "next/head";

function Home({stars}: any) {
  return (
    <div>
      <Head>
        <title key="title">My page title</title>
        <meta key="viewport" name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div>Welcome to Next.js! {stars}</div>
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
