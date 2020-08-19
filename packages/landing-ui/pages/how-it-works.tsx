import { HowItWorks } from '../src/how-it-works/HowItWorks';
import { Head } from '../src/common/Head';
import { useTranslation } from '../src/common/i18n';

function HowItWorksPage() {
  const { t } = useTranslation();
  return (
    <>
      <Head
        previewImages={['/logo-512x512.png']}
        siteName='la.mk'
        title={t('landing.howItWorksPage')}
        description={t('howItWorks.heroExplanation')}
      />
      <HowItWorks />
    </>
  );
}

export default HowItWorksPage;
