import React from "react";
import { Templates } from "..";
import { Layout as StandardLayout } from "../../templates/Standard/account/Layout";
import { Layout as ElegantLayout } from "../../templates/Elegant/account/Layout";
import { useAuth } from "../../hooks/useAuth";
import { User } from "../../domain/user";

export interface AccountLayoutProps {
  children: React.ReactNode;
  user: User | undefined;
}

export const Layout = ({
  children,
  template,
}: {
  children: React.ReactNode;
  template: Templates;
}) => {
  const { user } = useAuth();

  switch (template) {
    case "standard":
      return <StandardLayout user={user}>{children}</StandardLayout>;
    case "elegant":
      return <ElegantLayout user={user}>{children}</ElegantLayout>;
  }
};
