import React from "react";
import { MarkdownViewer } from "@la-mk/blocks-ui";
import { useTranslation } from "next-i18next";
import { useBreadcrumbs } from "../../hooks/useBreadcrumbs";
import { Page } from "../../layout/Page";
import { urls } from "../../tooling/url";

export const LegalContent = ({
  url,
  title,
  body,
}: {
  url: string;
  title: string;
  body: string;
}) => {
  const { t } = useTranslation("translation");

  useBreadcrumbs([
    { url: urls.home, title: t("pages.home") },
    { url: urls.legal, title: t("pages.legal") },
    { url, title },
  ]);

  return (
    <Page maxWidth={"86rem"} title={title}>
      <MarkdownViewer titleLevelOffset={1}>{body}</MarkdownViewer>
    </Page>
  );
};
