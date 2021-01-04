import { Head } from '../../src/common/pageComponents/Head';
import { useTranslation } from '../../src/common/i18n';
import { sdk } from '@la-mk/la-sdk';
import { getStore } from '../../src/state/modules/store/store.selector';
import { NextPageContext } from 'next';
import { StoreContents } from '@la-mk/la-sdk/dist/models/storeContents';
import { AboutUs } from '../../src/components/aboutUs/AboutUs';
import { Store } from '@la-mk/la-sdk/dist/models/store';
import { getTextSnippet } from '../../src/common/utils';

function AboutPage({
  store,
  aboutUs,
}: {
  store: Store | undefined;
  aboutUs: StoreContents['aboutUs'] | undefined;
}) {
  const { t } = useTranslation();
  return (
    <>
      <Head
        siteName={store?.name}
        title={t('pages.aboutUs')}
        description={
          getTextSnippet(aboutUs?.description) ??
          `${t('pages.aboutUs')}, ${store?.name}`
        }
      />
      <AboutUs aboutUs={aboutUs} />
    </>
  );
}

AboutPage.getInitialProps = async (ctx: NextPageContext & { store: any }) => {
  try {
    const state = ctx.store.getState();
    const store = getStore(state);
    if (!store) {
      return {};
    }

    const aboutUs = await sdk.storeContents.getAboutUsForStore(store._id);
    return { store, aboutUs };
  } catch (err) {
    console.log(err);
  }

  return {};
};

export default AboutPage;
