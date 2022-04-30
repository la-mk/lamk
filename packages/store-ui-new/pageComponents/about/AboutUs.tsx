import React from "react";
import { MarkdownViewer, Result } from "@la-mk/blocks-ui";
import { useTranslation } from "next-i18next";
// import { useBreadcrumb } from "../shared/hooks/useBreadcrumb";
import { Page } from "../../layout/Page";
import { useBreadcrumbs } from "../../hooks/useBreadcrumbs";

interface AboutUsProps {
  markdownDescription: string | undefined;
}

export const AboutUs = ({ markdownDescription }: AboutUsProps) => {
  const { t } = useTranslation("translation");
  useBreadcrumbs([
    { url: "/", title: t("pages.home") },
    { url: "/about", title: t("pages.aboutUs") },
  ]);

  return (
    <Page maxWidth={"86rem"} title={t("pages.aboutUs")}>
      {markdownDescription ? (
        <MarkdownViewer titleLevelOffset={1}>
          {markdownDescription}
        </MarkdownViewer>
      ) : (
        <Result status="empty" description={t("store.noAboutusInformation")} />
      )}
    </Page>
  );
};
