import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { OnboardingRouter } from './onboarding/Onboarding.router';
import { DashboardRouter } from './dashboard/Dashboard.router';

export const RootRouter = () => {
  return (
    <Switch>
      <Route path='/onboarding' component={OnboardingRouter} />
      <Route path='/dashboard' component={DashboardRouter} />
    </Switch>
  );
};
