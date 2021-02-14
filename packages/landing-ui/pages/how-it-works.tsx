import { HowItWorks } from '../src/how-it-works/HowItWorks';
import { Head } from '../src/common/Head';
import { useTranslation } from '../src/common/i18n';

function HowItWorksPage() {
  const { t } = useTranslation();
  return (
    <>
      <Head
        url='/how-it-works'
        title={t('landing.howItWorksPage')}
        description={t('howItWorks.heroExplanation')}
      />
      <HowItWorks />
    </>
  );
}

export default HowItWorksPage;
