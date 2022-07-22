import React from "react";
import { Templates } from "..";
import { Shell as StandardShell } from "../../templates/Standard/layout/shell";
import { Shell as ElegantShell } from "../../templates/Elegant/layout/shell";
import { Store } from "../../domain/store";
import { useRouter } from "next/router";
import { useAuth } from "../../hooks/useAuth";
import { urls } from "../../tooling/url";
import { User } from "../../domain/user";

export interface ShellProps {
  store: Store;
  user: User | undefined;
  children: React.ReactNode;
  isInAccountsPage: boolean;
}

export const Shell = ({
  store,
  template,
  children,
}: {
  store: Store;
  template: Templates;
  children: React.ReactNode;
}) => {
  const { pathname } = useRouter();
  const { user } = useAuth();
  const isInAccountsPage = !!user && pathname.startsWith(urls.account);

  const props = {
    store,
    user,
    children,
    isInAccountsPage,
  };

  switch (template) {
    case "standard":
      return <StandardShell {...props} />;
    case "elegant":
      return <ElegantShell {...props} />;
  }
};
