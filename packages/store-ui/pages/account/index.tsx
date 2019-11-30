import { Head } from '../common/Head';
import { useSelector } from 'react-redux';
import { getUser } from '../../src/state/modules/user/user.selector';
import { Account } from '../../src/components/account/Account';
import { Empty } from '@lamk/blocks-ui';
import { useTranslation } from '../../src/common/i18n';

function AccountPage() {
  const user = useSelector(getUser);
  const { t } = useTranslation();

  if (!user) {
    return <Empty mt={5} description={t('auth.noUserInformation')} />;
  }

  return (
    <>
      <Head title={t('pages.myAccount')} />
      <Account user={user} />
    </>
  );
}

export default AccountPage;
