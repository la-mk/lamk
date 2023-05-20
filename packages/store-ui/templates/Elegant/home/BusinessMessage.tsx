import { Box, Flex, Heading, Text } from "@la-mk/blocks-ui";
import React from "react";
import { HeadingLine } from "./HeadingLine";
import { useTranslation } from "next-i18next";

export const BusinessMessage = () => {
  const { t: tCustom } = useTranslation("custom");

  return (
    <Flex my={[8, 8, 9]} px={6} maxWidth="38rem" mx="auto" direction="column">
      <Heading as="h2" size="lg" mb={3}>
        {tCustom("home.businessMessageTitle")}
      </Heading>
      <HeadingLine />
      <Text pl={[3, 4, 5]}>{tCustom("home.businessMessageDescription")}</Text>
    </Flex>
  );
};
