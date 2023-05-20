import { Box, Flex, Heading, Image, Text } from "@la-mk/blocks-ui";
import React from "react";
import { ImageBackgroundBox } from "../../../components/ImageBackgroundBox";
import { HeadingLine } from "./HeadingLine";
import { useTranslation } from "next-i18next";

export const Featured = () => {
  const { t: tCustom } = useTranslation("custom");

  return (
    <Flex direction={["column", "row", "row"]} width="100%" mb={[8, 8, 9]}>
      <Flex align={"center"} justify="center" flex="1" bg="gray.200">
        <Box p={6} maxWidth={["26rem", "26rem", "32rem"]}>
          <Text size="sm" color="mutedText.dark">
            {tCustom("home.featuredSubheading")}
          </Text>
          <Heading mb={3}>{tCustom("home.featuredTitle")}</Heading>
          <HeadingLine />
          <Text>{tCustom("home.featuredDescription")}</Text>
        </Box>
      </Flex>
      <Flex flex="1">
        <ImageBackgroundBox
          mx="auto"
          // url={getImageURL(banner?._id ?? "", storeId, { h: 600 }) ?? ""}
          url={"https://artifacts.la.mk/custom/mokudo/featured.jpg"}
          height={["24rem", "36rem", "44rem"]}
          width="100%"
          // @ts-ignore
          style={{ position: "relative" }}
        ></ImageBackgroundBox>
      </Flex>
    </Flex>
  );
};
