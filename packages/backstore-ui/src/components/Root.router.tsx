import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { OnboardingRouter } from './onboarding/Onboarding.router';
import { DashboardRouter } from './dashboard/Dashboard.router';
import { Signup } from './signup/Signup';
import { Login } from './signup/Login';

export interface RootRouterProps {
  hasFinishedOnboarding: boolean;
}

export const RootRouter = () => {
  return (
    <Switch>
      <Route path='/signup' component={Signup} />
      <Route path='/login' component={Login} />
      <Route path='/onboarding' component={OnboardingRouter} />
      <Route path='/dashboard' component={DashboardRouter} />
      <Redirect to={'/dashboard'} />
    </Switch>
  );
};
