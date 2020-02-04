import { Head } from '../../src/common/pageComponents/Head';
import { useSelector } from 'react-redux';
import { getUser } from '../../src/state/modules/user/user.selector';
import { Account } from '../../src/components/account/Account';
import { Empty } from '@sradevski/blocks-ui';
import { useTranslation } from '../../src/common/i18n';
import { Store } from '@sradevski/la-sdk/dist/models/store';
import { NextPageContext } from 'next';
import { getStore } from '../../src/state/modules/store/store.selector';

function AccountPage({ store }: { store: Store | undefined }) {
  const user = useSelector(getUser);
  const { t } = useTranslation();

  if (!user) {
    return <Empty mt={6} description={t('auth.noUserInformation')} />;
  }

  return (
    <>
      <Head storeName={store && store.name} title={t('pages.myAccount')} />
      <Account user={user} />
    </>
  );
}

AccountPage.getInitialProps = async (ctx: NextPageContext & { store: any }) => {
  try {
    const state = ctx.store.getState();
    const store = getStore(state);
    return { store };
  } catch (err) {
    console.log(err);
  }

  return {};
};

export default AccountPage;
