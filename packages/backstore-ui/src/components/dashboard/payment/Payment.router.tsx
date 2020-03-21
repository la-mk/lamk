import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { Payment } from './Payment';

export const PaymentRouter = () => {
  return (
    <Switch>
      <Route path='/dashboard/payment' component={Payment} />
      <Redirect to='/dashboard/payment' />
    </Switch>
  );
};
