import React from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';
import { TabbedRouteRenderer } from '../../shared/components/TabbedRouteRenderer';
import { useTranslation } from 'react-i18next';
import { InterfacePreferences } from './InterfacePreferences';

export const PreferencesRouter = () => {
  const { t } = useTranslation();

  return (
    <Switch>
      <Route
        path={`/dashboard/preferences/:tab`}
        render={({ match, history }) => (
          <TabbedRouteRenderer
            match={match}
            history={history}
            title={t('common.preferences')}
            items={[
              {
                title: t('common.interface'),
                content: <InterfacePreferences />,
              },
            ]}
          />
        )}
      />

      <Redirect to='/dashboard/preferences/0' />
    </Switch>
  );
};
