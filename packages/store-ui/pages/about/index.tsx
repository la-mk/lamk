import { Head } from '../common/Head';
import { useTranslation } from '../../src/common/i18n';

function AboutPage() {
  const { t } = useTranslation();
  return (
    <>
      <Head title={t('pages.aboutUs')} />
      <div>This is the about page</div>
    </>
  );
}

export default AboutPage;
