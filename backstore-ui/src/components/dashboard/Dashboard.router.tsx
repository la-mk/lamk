import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { OrdersRouter } from './orders/Orders.router';
import { DashboardLayout } from './DashboardLayout';
import { ProductsdRouter } from './products/Products.router';

export const DashboardRouter = () => {
  return (
    <DashboardLayout>
      <Switch>
        <Route path='/dashboard/orders' component={OrdersRouter} />
        <Route path='/dashboard/products' component={ProductsdRouter} />
        <Redirect to='/dashboard/orders' />
      </Switch>
    </DashboardLayout>
  );
};
