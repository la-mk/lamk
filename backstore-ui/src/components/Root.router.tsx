import React from 'react';
import { OnboardingRouter } from './onboarding/Onboarding.router';
import { Route, Redirect, Switch } from 'react-router-dom';

export const RootRouter = () => {
  return (
    <Switch>
      <Route path='/onboarding' component={OnboardingRouter} />
      <Redirect to='/onboarding' />
    </Switch>
  );
};
