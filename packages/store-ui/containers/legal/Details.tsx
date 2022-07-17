import { LegalContent as StandardLegalContent } from "../../templates/Standard/legal/LegalContent";
import { LegalContent as ElegantLegalContent } from "../../templates/Elegant/legal/LegalContent";
import { Templates } from "..";

export interface LegalContentProps {
  url: string;
  title: string;
  body: string;
}

export const LegalContent = ({
  template,
  ...props
}: { template: Templates } & LegalContentProps) => {
  switch (template) {
    case "standard":
      return <StandardLegalContent {...props} />;
    case "elegant":
      return <ElegantLegalContent {...props} />;
  }
};
