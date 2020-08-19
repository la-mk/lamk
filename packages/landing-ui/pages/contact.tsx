import { Contact } from '../src/contact/Contact';
import { Head } from '../src/common/Head';
import { useTranslation } from '../src/common/i18n';

function ContactPage() {
  const { t } = useTranslation();
  return (
    <>
      <Head
        previewImages={['/logo-512x512.png']}
        siteName='la.mk'
        title={t('landing.contactUsPage')}
        description={t('landingContact.heroExplanation')}
      />
      <Contact />
    </>
  );
}

export default ContactPage;
