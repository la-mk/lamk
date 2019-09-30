import { sdk } from 'la-sdk';
import { Head } from '../common/Head';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getUser } from '../../src/state/modules/user/user.selector';
import { Account } from '../../src/components/account/Account';

function AccountPage() {
  const user = useSelector(getUser);

  return (
    <>
      <Head title='My Account' />
      <Account user={user} />
    </>
  );
}

export default AccountPage;
