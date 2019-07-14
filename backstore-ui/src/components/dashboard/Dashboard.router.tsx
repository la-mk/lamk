import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { Orders } from './Orders';
import { DashboardLayout } from './DashboardLayout';

export const DashboardRouter = () => {
  return (
    <DashboardLayout>
      <Switch>
        <Route path='/dashboard/orders' component={Orders} />
        <Redirect to='/dashboard/orders' />
      </Switch>
    </DashboardLayout>
  );
};
