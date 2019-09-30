import React from 'react';
import { Route, Switch, RouteComponentProps, Redirect } from 'react-router-dom';
import { Preferences } from './Preferences';

export const PreferencesRouter = () => {
  return (
    <Switch>
      <Route
        path='/dashboard/preferences/:tab'
        render={({ match, history }: RouteComponentProps<{ tab?: string }>) => (
          <Preferences
            tab={match.params.tab}
            setTab={(tab: string) => history.push(tab)}
          />
        )}
      />
      <Redirect to='/dashboard/preferences/store' />
    </Switch>
  );
};
