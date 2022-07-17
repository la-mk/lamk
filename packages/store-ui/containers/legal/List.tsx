import { Legal as StandardLegal } from "../../templates/Standard/legal/Legal";
import { Legal as ElegantLegal } from "../../templates/Elegant/legal/Legal";
import { Templates } from "..";

export interface LegalProps {}

export const Legal = ({ template }: { template: Templates }) => {
  switch (template) {
    case "standard":
      return <StandardLegal />;
    case "elegant":
      return <ElegantLegal />;
  }
};
