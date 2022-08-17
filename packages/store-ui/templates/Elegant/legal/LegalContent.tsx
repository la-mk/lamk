import React from "react";
import { MarkdownViewer } from "@la-mk/blocks-ui";
import { useTranslation } from "next-i18next";
import { Page } from "../Page";
import { LegalContentProps } from "../../../containers/legal/Details";

export const LegalContent = ({ url, title, body }: LegalContentProps) => {
  const { t } = useTranslation("translation");

  return (
    <>
      <Page maxWidth={"86rem"} title={title}>
        <MarkdownViewer titleLevelOffset={1}>{body}</MarkdownViewer>
      </Page>
    </>
  );
};
