import { Head } from '../common/Head';
import { useSelector } from 'react-redux';
import { getUser } from '../../src/state/modules/user/user.selector';
import { Account } from '../../src/components/account/Account';
import { Empty } from '@lamk/blocks-ui';

function AccountPage() {
  const user = useSelector(getUser);

  if (!user) {
    return (
      <Empty
        mt={5}
        description='Could not load user information. Check if you are logged in.'
      />
    );
  }

  return (
    <>
      <Head title='My Account' />
      <Account user={user} />
    </>
  );
}

export default AccountPage;
