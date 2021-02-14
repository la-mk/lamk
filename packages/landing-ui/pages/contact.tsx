import { Contact } from '../src/contact/Contact';
import { Head } from '../src/common/Head';
import { useTranslation } from '../src/common/i18n';

function ContactPage() {
  const { t } = useTranslation();
  return (
    <>
      <Head
        url='/contract'
        title={t('landing.contactUsPage')}
        description={t('landingContact.heroExplanation')}
      />
      <Contact />
    </>
  );
}

export default ContactPage;
