import { Head } from '../common/Head';
import { useTranslation } from '../../src/common/i18n';
import { sdk } from '@lamk/la-sdk';
import { getStore } from '../../src/state/modules/store/store.selector';
import { NextPageContext } from 'next';
import { StoreContents } from '@lamk/la-sdk/dist/models/storeContents';
import { AboutUs } from '../../src/components/aboutUs/AboutUs';

function AboutPage({
  aboutUs,
}: {
  aboutUs: StoreContents['aboutUs'] | undefined;
}) {
  const { t } = useTranslation();
  return (
    <>
      <Head title={t('pages.aboutUs')} />
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
    return { aboutUs };
  } catch (err) {
    console.log(err);
  }

  return {};
};

export default AboutPage;
