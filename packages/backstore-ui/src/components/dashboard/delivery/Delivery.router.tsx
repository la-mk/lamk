import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { Delivery } from './Delivery';

export const DeliveryRouter = () => {
  return (
    <Switch>
      <Route path='/dashboard/delivery' component={Delivery} />
      <Redirect to='/dashboard/delivery' />
    </Switch>
  );
};
