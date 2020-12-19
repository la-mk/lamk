import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { Store } from './Store';
import { TabbedRouteRenderer } from '../../shared/components/TabbedRouteRenderer';
import { useTranslation } from 'react-i18next';
import { AboutUs } from './AboutUs';
import { LandingPreferences } from './LandingPreferences';
import { Company } from './Company';

export const StoreRouter = () => {
  const { t } = useTranslation();
  return (
    <Switch>
      <Route
        path={`/dashboard/store/:tab`}
        render={({ match, history }) => (
          <TabbedRouteRenderer
            match={match}
            history={history}
            items={[
              {
                title: t('common.basic'),
                content: <Store />,
              },
              {
                title: t('common.company'),
                content: <Company />,
              },
              {
                title: t('store.aboutUs'),
                content: <AboutUs />,
              },
              {
                title: t('store.landingPage'),
                content: <LandingPreferences />,
              },
            ]}
          />
        )}
      />

      <Redirect to='/dashboard/store/0' />
    </Switch>
  );
};
