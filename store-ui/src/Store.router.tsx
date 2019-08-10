import React from 'react';
import { StoreLayout } from './StoreLayout';
import { Store } from './Store';
import { Products } from './Products/Products';

export const StoreRouter = () => {
  return (
    <StoreLayout>
      <Store/>
      <Products products={[]}/>
      {/* <Switch>
        <Route exact path='/store' component={Store} />
        <Route path='/store/products' component={Products} />
        <Redirect to='/store' />
      </Switch> */}
    </StoreLayout>
  );
};
