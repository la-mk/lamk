import React from "react";
import { Flex, MarkdownViewer, Text } from "@la-mk/blocks-ui";
import { useTranslation } from "next-i18next";
import { Page } from "../Page";
import { AboutUsProps } from "../../../containers/about";

export const AboutUs = ({ markdownDescription }: AboutUsProps) => {
  const { t } = useTranslation("translation");

  return (
    <>
      <Page maxWidth={"70rem"} title={t("pages.aboutUs")}>
        {markdownDescription ? (
          <MarkdownViewer titleLevelOffset={1}>
            {markdownDescription}
          </MarkdownViewer>
        ) : (
          <Flex align={"center"} justify="center">
            <Text color="mutedText.dark" mx="auto">
              {t("store.noAboutusInformation")}
            </Text>
          </Flex>
        )}
      </Page>
    </>
  );
};
