import React from "react";
import { Switch, Redirect, Route } from "react-router-dom";
import { TabbedRouteRenderer } from "../../shared/components/TabbedRouteRenderer";
import { useTranslation } from "react-i18next";
import { TabPane } from "@lamk/blocks-ui";
import { InterfacePreferences } from "./InterfacePreferences";

export const PreferencesRouter = () => {
  const { t } = useTranslation();

  return (
    <Switch>
      <Route
        path={`/dashboard/preferences/:tab`}
        render={({ match, history }) => (
          <TabbedRouteRenderer match={match} history={history} title={t("common.preferences")}>
            <TabPane tab={t("common.interface")} key="interface">
              <InterfacePreferences />
            </TabPane>
          </TabbedRouteRenderer>
        )}
      />

      <Redirect to="/dashboard/preferences/interface" />
    </Switch>
  );
};
