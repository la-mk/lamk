import React from "react";
import { MarkdownViewer, Result } from "@la-mk/blocks-ui";
import { useTranslation } from "next-i18next";
import { Page } from "../Page";
import { urls } from "../../../tooling/url";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { AboutUsProps } from "../../../containers/about";

export const AboutUs = ({ markdownDescription }: AboutUsProps) => {
  const { t } = useTranslation("translation");

  return (
    <>
      <Breadcrumbs
        breadcrumbs={[
          { url: urls.home, title: t("pages.home") },
          { url: urls.about, title: t("pages.aboutUs") },
        ]}
      />
      <Page maxWidth={"86rem"} title={t("pages.aboutUs")}>
        {markdownDescription ? (
          <MarkdownViewer titleLevelOffset={1}>
            {markdownDescription}
          </MarkdownViewer>
        ) : (
          <Result
            status="empty"
            description={t("store.noAboutusInformation")}
          />
        )}
      </Page>
    </>
  );
};
