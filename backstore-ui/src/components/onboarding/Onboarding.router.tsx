import toInteger from 'lodash/toInteger';
import React from 'react';
import { Route, Redirect, Switch, RouteComponentProps } from 'react-router-dom';
import { Onboarding } from './Onboarding';

export const OnboardingRouter = () => {
  return (
    <Switch>
      <Route
        path='/onboarding/:step'
        render={({
          match,
          history,
        }: RouteComponentProps<{ step?: string }>) => (
          <Onboarding
            step={toInteger(match.params.step || 0)}
            setStep={(step: number) => history.push(`${step}`)}
          />
        )}
      />
      <Redirect to='/onboarding/0' />
    </Switch>
  );
};
