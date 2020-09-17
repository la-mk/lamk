import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { OnboardingRouter } from './onboarding/Onboarding.router';
import { DashboardRouter } from './dashboard/Dashboard.router';
import { Signup } from './auth/Signup';
import { Login } from './auth/Login';
import { ResetPassword } from './auth/ResetPassword';
import { ForgotPassword } from './auth/ForgotPassword';

export interface RootRouterProps {
  hasFinishedOnboarding: boolean;
}

export const RootRouter = () => {
  return (
    <Switch>
      <Route path='/signup' component={Signup} />
      <Route path='/login' component={Login} />
      <Route
        path='/resetPassword'
        render={({ location }) => (
          <ResetPassword
            resetToken={new URLSearchParams(location.search).get('resetToken')}
          />
        )}
      />
      <Route path='/forgotPassword' component={ForgotPassword} />
      <Route path='/onboarding' component={OnboardingRouter} />
      <Route path='/dashboard' component={DashboardRouter} />
      <Redirect to={'/dashboard'} />
    </Switch>
  );
};
