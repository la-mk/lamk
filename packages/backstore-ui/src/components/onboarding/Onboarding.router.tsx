import { ErrorBoundary } from '@la-mk/blocks-ui';
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
          <ErrorBoundary>
            <Onboarding
              step={toInteger(match.params.step || 0)}
              setStep={(step: number) => history.push(`${step}`)}
            />
          </ErrorBoundary>
        )}
      />
      <Redirect to='/onboarding/0' />
    </Switch>
  );
};
