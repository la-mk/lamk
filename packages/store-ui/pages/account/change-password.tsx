import { Head } from '../../src/common/pageComponents/Head';
import { useSelector } from 'react-redux';
import { getUser } from '../../src/state/modules/user/user.selector';
import { ChangePassword } from '../../src/components/account/ChangePassword';
import { Result } from '@la-mk/blocks-ui';
import { useTranslation } from '../../src/common/i18n';
import { Store } from '@la-mk/la-sdk/dist/models/store';
import { NextPageContext } from 'next';
import { getStore } from '../../src/state/modules/store/store.selector';

function ChangePasswordPage({ store }: { store: Store | undefined }) {
  const user = useSelector(getUser);
  const { t } = useTranslation();

  if (!user) {
    return (
      <Result status='empty' mt={8} description={t('auth.noUserInformation')} />
    );
  }

  const fullName = `${user.firstName ?? ''} ${user.lastName ?? ''}`;
  const nameDescription = fullName.length < 3 ? user.email : fullName;

  return (
    <>
      <Head
        url={'/account/change-password'}
        store={store}
        title={t('pages.myAccount')}
        description={`${t('pages.myAccount')}, ${nameDescription}`}
      />
      <ChangePassword user={user} />
    </>
  );
}

ChangePasswordPage.getInitialProps = async (
  ctx: NextPageContext & { store: any },
) => {
  try {
    const state = ctx.store.getState();
    const store = getStore(state);
    return { store };
  } catch (err) {
    console.log(err);
  }

  return {};
};

export default ChangePasswordPage;
