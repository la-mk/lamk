import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { OnboardingRouter } from './onboarding/Onboarding.router';
import { DashboardRouter } from './dashboard/Dashboard.router';
import { StoreRouter } from './store/Store.router';

export interface RootRouterProps {
  hasFinishedOnboarding: boolean;
}

export const RootRouter = ({ hasFinishedOnboarding }: RootRouterProps) => {
  return (
    <Switch>
      <Route path='/onboarding' component={OnboardingRouter} />
      <Route path='/dashboard' component={DashboardRouter} />
      <Route path='/store' component={StoreRouter} />
      <Redirect to='/store' />
      {/* <Redirect to={hasFinishedOnboarding ? '/dashboard' : 'onboarding'} /> */}
    </Switch>
  );
};
