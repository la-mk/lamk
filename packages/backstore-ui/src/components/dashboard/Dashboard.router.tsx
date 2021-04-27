import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { ErrorBoundary } from '@la-mk/blocks-ui';
import { OrdersRouter } from './orders/Orders.router';
import { DashboardLayout } from './DashboardLayout';
import { ProductsRouter } from './products/Products.router';
import { CampaignsRouter } from './campaigns/Campaigns.router';
import { StoreRouter } from './store/Store.router';
import { DeliveryRouter } from './delivery/Delivery.router';
import { PaymentRouter } from './payment/Payment.router';
import { PreferencesRouter } from './preferences/Preferences.router';
import { AccountRouter } from './account/Account.router';
import { Summary } from './summary/Summary';
import { IntegrationsRouter } from './integrations/Integrations.router';
import { useSelector } from 'react-redux';
import { getStore } from '../../state/modules/store/store.selector';
import { FullScreenSpinner } from '../shared/components/FullScreenSpinner';

export const DashboardRouter = () => {
  const store = useSelector(getStore);
  if (!store) {
    return <FullScreenSpinner />;
  }

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
          <Route path='/dashboard/account' component={AccountRouter} />
          <Route
            path='/dashboard/integrations'
            component={IntegrationsRouter}
          />
          <Redirect to='/dashboard/summary' />
        </Switch>
      </ErrorBoundary>
    </DashboardLayout>
  );
};
