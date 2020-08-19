import { Faq } from '../src/faq/Faq';
import { Head } from '../src/common/Head';
import { useTranslation } from '../src/common/i18n';

function FaqPage() {
  const { t } = useTranslation();
  return (
    <>
      <Head
        previewImages={['https://la.mk/logo-padding.png']}
        siteName='la.mk'
        title={t('landing.faqPage')}
        description={t('landingFaq.heroExplanation')}
      />
      <Faq />
    </>
  );
}

export default FaqPage;
