import React from 'react';
import { MainPointCard } from './MainPointCard';

export const MainPoints = () => {
  return (
    <>
      <MainPointCard
        side='right'
        mt={[50, 70, 100]}
        image='/responsive-store-girl.svg'
        overflow='top'
        title='World-class store, without the hustle'
        description='Your job is to manage your products, and we will take care of the rest. 
        Blazing fast, SEO optimized, and user-friendly website within a click away. We take care of the complexity of making your store run 24x7, 
        all you need to do is sell.'
      />

      <MainPointCard
        side='left'
        mt={[50, 70, 100]}
        image='/admin-panel-guy.svg'
        overflow='both'
        title='Admin panel for the modern age'
        description='Manage your products, orders, campaigns and more from a single place. See how your store is doing with the built-in analytics.'
      />
      <MainPointCard
        side='right'
        mt={[50, 70, 100]}
        image='/warming-up-people.svg'
        overflow='top'
        title='We are just warming up'
        description='We are building the best platform around, and we want to do it together. '
      />
    </>
  );
};
