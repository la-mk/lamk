import { Faq } from '../src/faq/Faq';
import { Head } from '../src/common/Head';
import { useTranslation } from '../src/common/i18n';

function FaqPage() {
  const { t } = useTranslation();
  return (
    <>
      <Head
        previewImages={['/logo-512x512.png']}
        siteName='la.mk'
        title={t('landing.faqPage')}
        description={t('landingFaq.heroExplanation')}
      />
      <Faq />
    </>
  );
}

export default FaqPage;
