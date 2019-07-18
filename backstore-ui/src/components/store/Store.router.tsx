import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { Store } from './Store';
import { StoreLayout } from './StoreLayout';
import { Products } from './Products/Products';

export const StoreRouter = () => {
  return (
    <StoreLayout>
      <Switch>
        <Route exact path='/store' component={Store} />
        <Route path='/store/products' component={Products} />
        <Redirect to='/store' />
      </Switch>
    </StoreLayout>
  );
};
