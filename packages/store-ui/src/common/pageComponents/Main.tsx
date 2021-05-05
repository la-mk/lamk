import React from 'react';
import { Provider as ThemeProvider, CookieBanner } from '@la-mk/blocks-ui';
import { ConnectedRouter } from 'connected-next-router';
import { StoreLayout } from './StoreLayout';
import { AuthModal } from '../../components/auth/AuthModal';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from '../../common/i18n';
import { getTheme } from '../../common/theme';
import { StoreNotFound } from './StoreNotFound';
import {
  ConsentPreferences,
  consentsChange,
} from '../../state/modules/analytics/analytics.module';
import { getConsents } from '../../state/modules/analytics/analytics.selector';

const getTranslations = (t: (key: string) => string) => {
  return {
    firstName: t('common.firstName'),
    lastName: t('common.lastName'),
    phoneNumber: t('common.phoneNumber'),
    email: t('common.email'),
    password: t('common.password'),
    currentPassword: t('common.currentPassword'),
    newPassword: t('common.newPassword'),
    forgotPassword: t('auth.forgotPassword'),
    forgotPasswordExplanation: t('auth.forgotPasswordExplanation'),
    resetPassword: t('auth.resetPassword'),
    resetPasswordExplanation: t('auth.resetPasswordExplanation'),
    sendPasswordResetLink: t('actions.sendPasswordResetLink'),
    loginInstead: t('actions.loginInstead'),
    forgotPasswordSuccess: t('auth.forgotPasswordSuccess'),
    forgotPasswordSuccessExplanation: t(
      'auth.forgotPasswordSuccessExplanation',
    ),
    signup: t('auth.signup'),
    login: t('auth.login'),
    or: t('common.or'),
    authSameAccount: t('auth.authSameAccount'),
    update: t('actions.update'),
    registerConfirmTermsOfService: t('auth.registerConfirmTermsOfService'),
    termsOfService: t('auth.termsOfService'),
    collectAccountInfoReviewPolicy: t('auth.collectAccountInfoReviewPolicy'),
    privacyPolicy: t('auth.privacyPolicy'),
    forMoreDetails: t('auth.forMoreDetails'),
    cookiesExplanation: t('auth.cookiesExplanation'),
    readMoreCookies: t('auth.readMoreCookies'),
    acceptCookies: t('actions.acceptCookies'),
    decline: t('actions.declineOptional'),
  };
};

export const Main = ({ laStore, children }) => {
  const { t } = useTranslation();
  const consents = useSelector(getConsents);
  const dispatch = useDispatch();
  const brandColor = laStore?.color;

  return (
    <ThemeProvider
      // @ts-ignore
      theme={getTheme(brandColor)}
      translations={getTranslations(t)}
    >
      <ConnectedRouter>
        {laStore ? (
          <StoreLayout>
            <>
              {children}
              <AuthModal />
              <CookieBanner
                onConsentsChanged={updatedConsents =>
                  dispatch(
                    consentsChange(
                      (updatedConsents as unknown) as ConsentPreferences,
                    ),
                  )
                }
                consents={consents}
                privacyPolicyLink={'/legal/privacy'}
                requests={[{ key: 'analytics', title: 'Analytics' }]}
              />
            </>
          </StoreLayout>
        ) : (
          <StoreNotFound t={t} />
        )}
      </ConnectedRouter>
    </ThemeProvider>
  );
};
