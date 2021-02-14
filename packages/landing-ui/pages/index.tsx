import { Home } from '../src/home/Home';
import { Head } from '../src/common/Head';
import { useTranslation } from '../src/common/i18n';

function HomePage() {
  const { t } = useTranslation();

  return (
    <>
      <Head
        url='https://la.mk'
        title={t('landing.homePage')}
        description={t('company.subTagline')}
      />
      <Home />
    </>
  );
}

export default HomePage;

// This function gets called at build time
export async function getStaticProps() {
  // Call an external API endpoint to get posts
  // const res = await fetch('https://.../posts');
  // const posts = await res.json();

  // By returning { props: posts }, the Blog component
  // will receive `posts` as a prop at build time
  return {
    props: {
      somedynamicdata: [],
    },
  };
}
