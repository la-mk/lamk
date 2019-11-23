import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { Store } from './Store';
import { TabbedRouteRenderer } from '../../shared/components/TabbedRouteRenderer';
import { TabPane } from '@lamk/blocks-ui';
import { useTranslation } from 'react-i18next';
import {AboutUs} from './AboutUs';

export const StoreRouter = () => {
  const {t} = useTranslation();
  return (
    <Switch>
      <Route
        path={`/dashboard/store/:tab`}
        render={({ match, history }) => (
          <TabbedRouteRenderer match={match} history={history} title={t("commerce.store")}>
            <TabPane tab={t("common.basic")} key="basic">
              <Store />
            </TabPane>
            <TabPane tab={t("common.aboutUs")} key="about-us">
              <AboutUs />
            </TabPane>
          </TabbedRouteRenderer>
        )}
      />

      <Redirect to='/dashboard/store/basic' />
    </Switch>
  );
};
