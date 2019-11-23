import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { OrdersRouter } from './orders/Orders.router';
import { DashboardLayout } from './DashboardLayout';
import { ProductsRouter } from './products/Products.router';
import { StoreRouter } from './store/Store.router';
import { DeliveryRouter } from './delivery/Delivery.router';
import { PreferencesRouter } from './preferences/Preferences.router';
import { Summary } from './summary/Summary';

export const DashboardRouter = () => {
  return (
    <DashboardLayout>
      <Switch>
        <Route path='/dashboard/summary' component={Summary} />
        <Route path='/dashboard/orders' component={OrdersRouter} />
        <Route path='/dashboard/products' component={ProductsRouter} />
        <Route path='/dashboard/store' component={StoreRouter} />
        <Route path='/dashboard/delivery' component={DeliveryRouter} />
        <Route path='/dashboard/preferences' component={PreferencesRouter} />
        <Redirect to='/dashboard/summary' />
      </Switch>
    </DashboardLayout>
  );
};
