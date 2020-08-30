import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { OrdersRouter } from './orders/Orders.router';
import { DashboardLayout } from './DashboardLayout';
import { ProductsRouter } from './products/Products.router';
import { CampaignsRouter } from './campaigns/Campaigns.router';
import { StoreRouter } from './store/Store.router';
import { DeliveryRouter } from './delivery/Delivery.router';
import { PaymentRouter } from './payment/Payment.router';
import { PreferencesRouter } from './preferences/Preferences.router';
import { Summary } from './summary/Summary';
import { ErrorBoundary } from '../shared/components/ErrorBoundary';

export const DashboardRouter = () => {
  return (
    <DashboardLayout>
      <ErrorBoundary>
        <Switch>
          <Route path='/dashboard/summary' component={Summary} />
          <Route path='/dashboard/orders' component={OrdersRouter} />
          <Route path='/dashboard/products' component={ProductsRouter} />
          <Route path='/dashboard/campaigns' component={CampaignsRouter} />
          <Route path='/dashboard/store' component={StoreRouter} />
          <Route path='/dashboard/delivery' component={DeliveryRouter} />
          <Route path='/dashboard/payment' component={PaymentRouter} />
          <Route path='/dashboard/preferences' component={PreferencesRouter} />
          <Redirect to='/dashboard/summary' />
        </Switch>
      </ErrorBoundary>
    </DashboardLayout>
  );
};
