import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { Products } from './Products';

export const ProductsRouter = () => {
  return (
    <Switch>
      <Route path='/dashboard/products' component={Products} />
      <Redirect to='/dashboard/products' />
    </Switch>
  );
};
