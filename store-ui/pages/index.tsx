import { Home } from '../src/Home';
import { Provider } from 'blocks-ui';
import { Head } from '../src/common/Head';

function HomePage({ stars }: any) {
  return (
    <Provider>
      <>
        <Head title='Home' />
        <Home />
      </>
    </Provider>
  );
}

// See https://nextjs.org/docs#fetching-data-and-component-lifecycle
HomePage.getInitialProps = async () => {
  // This won't work, as fetch needs to be available in both node and browsers
  // const res = await fetch('https://api.github.com/repos/zeit/next.js');
  // const json = await res.json();
  // return { stars: json.stargazers_count };
  return { stars: 1 };
};

export default HomePage;
