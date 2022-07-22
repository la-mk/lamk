import React from "react";
import { Templates } from "..";
import { Footer as StandardFooter } from "../../templates/Standard/layout/footer";
import { Footer as ElegantFooter } from "../../templates/Elegant/layout/footer";
import { Store } from "../../domain/store";

export interface HeaderProps {
  store: Store;
}

export const Footer = ({
  store,
  template,
}: {
  store: Store;
  template: Templates;
}) => {
  const props = {
    store,
  };

  switch (template) {
    case "standard":
      return <StandardFooter {...props} />;
    case "elegant":
      return <ElegantFooter {...props} />;
  }
};
