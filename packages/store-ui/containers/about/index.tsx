import { AboutUs as StandardAboutUs } from "../../templates/Standard/about/AboutUs";
import { AboutUs as ElegantAboutUs } from "../../templates/Elegant/about/AboutUs";
import { Templates } from "..";

export interface AboutUsProps {
  markdownDescription: string | undefined;
}

export const AboutUs = ({
  template,
  markdownDescription,
}: { template: Templates } & AboutUsProps) => {
  switch (template) {
    case "standard":
      return <StandardAboutUs markdownDescription={markdownDescription} />;
    case "elegant":
      return <ElegantAboutUs markdownDescription={markdownDescription} />;
  }
};
