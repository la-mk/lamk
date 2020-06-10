import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { Store } from './Store';
import { TabbedRouteRenderer } from '../../shared/components/TabbedRouteRenderer';
import { TabPane } from '@sradevski/blocks-ui';
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
            title={t('commerce.store')}
          >
            <TabPane tab={t('common.basic')} key='basic'>
              <Store />
            </TabPane>
            <TabPane tab={t('common.company')} key='company'>
              <Company />
            </TabPane>
            <TabPane tab={t('store.aboutUs')} key='about-us'>
              <AboutUs />
            </TabPane>
            <TabPane tab={t('store.landingPage')} key='landing'>
              <LandingPreferences />
            </TabPane>
          </TabbedRouteRenderer>
        )}
      />

      <Redirect to='/dashboard/store/basic' />
    </Switch>
  );
};
