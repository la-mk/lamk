import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { Integrations } from './Integrations';

export const IntegrationsRouter = () => {
  return (
    <Switch>
      <Route path='/dashboard/integrations' component={Integrations} />
      <Redirect to='/dashboard/integrations' />
    </Switch>
  );
};
