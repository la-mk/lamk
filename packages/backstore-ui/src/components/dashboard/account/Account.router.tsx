import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { TabbedRouteRenderer } from '../../shared/components/TabbedRouteRenderer';
import { useTranslation } from 'react-i18next';
import { TabPane } from '@sradevski/blocks-ui';
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
          >
            <TabPane tab={t('common.personalInfo')} key='personal'>
              <PersonalForm user={user} t={t} />
            </TabPane>
            <TabPane tab={t('common.password')} key='password'>
              <PasswordForm user={user} t={t} />
            </TabPane>
          </TabbedRouteRenderer>
        )}
      />

      <Redirect to='/dashboard/account/personal' />
    </Switch>
  );
};
