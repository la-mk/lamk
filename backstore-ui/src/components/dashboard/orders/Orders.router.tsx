import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { Orders } from './Orders';

export const OrdersRouter = () => {
  return (
    <Switch>
      <Route path='/dashboard/orders' component={Orders} />
      <Redirect to='/dashboard/orders' />
    </Switch>
  );
};
