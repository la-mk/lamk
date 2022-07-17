import React from "react";
import { MarkdownViewer } from "@la-mk/blocks-ui";
import { useTranslation } from "next-i18next";
import { Page } from "../Page";
import { LegalContentProps } from "../../../containers/legal/Details";
// import { urls } from "../../tooling/url";
// import { Breadcrumbs } from "../../components/Breadcrumbs";

export const LegalContent = ({ url, title, body }: LegalContentProps) => {
  const { t } = useTranslation("translation");

  return (
    <>
      {/* <Breadcrumbs
        breadcrumbs={[
          { url: urls.home, title: t("pages.home") },
          { url: urls.legal, title: t("pages.legal") },
          { url, title },
        ]}
      /> */}
      <Page maxWidth={"86rem"} title={title}>
        <MarkdownViewer titleLevelOffset={1}>{body}</MarkdownViewer>
      </Page>
    </>
  );
};
