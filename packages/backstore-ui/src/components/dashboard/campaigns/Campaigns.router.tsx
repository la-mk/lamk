import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { Campaigns } from './Campaigns';

export const CampaignsRouter = () => {
  return (
    <Switch>
      <Route path='/dashboard/campaigns' component={Campaigns} />
      <Redirect to='/dashboard/campaigns' />
    </Switch>
  );
};
