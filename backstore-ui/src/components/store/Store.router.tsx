import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { Store } from './Store';
import { StoreLayout } from './StoreLayout';

export const StoreRouter = () => {
  return (
    <StoreLayout>
      <Switch>
        <Route path='/store' component={Store} />
        <Redirect to='/store' />
      </Switch>
    </StoreLayout>
  );
};
