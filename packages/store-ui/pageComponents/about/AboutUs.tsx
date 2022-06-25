import React from "react";
import { MarkdownViewer, Result } from "@la-mk/blocks-ui";
import { useTranslation } from "next-i18next";
import { Page } from "../../layout/Page";
import { useBreadcrumbs } from "../../hooks/useBreadcrumbs";
import { urls } from "../../tooling/url";

interface AboutUsProps {
  markdownDescription: string | undefined;
}

export const AboutUs = ({ markdownDescription }: AboutUsProps) => {
  const { t } = useTranslation("translation");
  useBreadcrumbs([
    { url: urls.home, title: t("pages.home") },
    { url: urls.about, title: t("pages.aboutUs") },
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
