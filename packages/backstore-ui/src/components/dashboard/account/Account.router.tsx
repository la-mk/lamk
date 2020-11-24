import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { TabbedRouteRenderer } from '../../shared/components/TabbedRouteRenderer';
import { useTranslation } from 'react-i18next';
import { PersonalForm } from './PersonalForm';
import { PasswordForm } from './PasswordForm';
import { useSelector } from 'react-redux';
import { getUser } from '../../../state/modules/user/user.selector';
import { User } from '@sradevski/la-sdk/dist/models/user';

export const AccountRouter = () => {
  const { t } = useTranslation();
  const user: User = useSelector(getUser);

  return (
    <Switch>
      <Route
        path={`/dashboard/account/:tab`}
        render={({ match, history }) => (
          <TabbedRouteRenderer
            match={match}
            history={history}
            title={t('auth.account')}
            items={[
              {
                title: t('common.personalInfo'),
                content: <PersonalForm user={user} t={t} />,
              },
              {
                title: t('common.password'),
                content: <PasswordForm user={user} t={t} />,
              },
            ]}
          />
        )}
      />

      <Redirect to='/dashboard/account/0' />
    </Switch>
  );
};
