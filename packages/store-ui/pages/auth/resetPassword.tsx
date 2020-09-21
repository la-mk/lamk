import { NextPageContext } from 'next';
import { Head } from '../../src/common/pageComponents/Head';
import { useTranslation } from '../../src/common/i18n';
import { getStore } from '../../src/state/modules/store/store.selector';
import { Store } from '@sradevski/la-sdk/dist/models/store';
import { ResetPassword } from '../../src/components/auth/ResetPassword';

function ResetPasswordPage({
  store,
  resetToken,
}: {
  store: Store | undefined;
  resetToken: string | undefined;
}) {
  const { t } = useTranslation();
  return (
    <>
      <Head
        siteName={store?.name}
        title={t('auth.resetPassword')}
        description={`${t('auth.resetPassword')}, ${store?.name}`}
      />
      <ResetPassword resetToken={resetToken} />
    </>
  );
}

ResetPasswordPage.getInitialProps = async (
  ctx: NextPageContext & { store: any },
) => {
  const resetToken = ctx.query?.resetToken;

  try {
    const state = ctx.store.getState();
    const store = getStore(state);
    return { store, resetToken };
  } catch (err) {
    console.log(err);
  }

  return { resetToken };
};

export default ResetPasswordPage;
