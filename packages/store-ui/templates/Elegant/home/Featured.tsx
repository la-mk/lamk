import { Box, Flex, Heading, Image, Text } from "@la-mk/blocks-ui";
import React from "react";
import { ImageBackgroundBox } from "../../../components/ImageBackgroundBox";
import { HeadingLine } from "./HeadingLine";

export const Featured = () => {
  return (
    <Flex direction={["column", "row", "row"]} width="100%" mb={[8, 8, 9]}>
      <Flex align={"center"} justify="center" flex="1" bg="gray.200">
        <Box p={6} maxWidth={["26rem", "26rem", "32rem"]}>
          <Text size="sm" color="mutedText.dark">
            Back in stock
          </Text>
          <Heading mb={3}>Arita Houen Chopstick Rest</Heading>
          <HeadingLine />
          <Text>
            Arita ware, the moniker for the exquisite white porcelain made in
            Arita, Japan, has a devoted following. In 2004, a collective of four
            makers and eight esteemed Japanese designers launched Arita Houen to
            bring Arita ware to a wider market. One of the results is these
            chopstick rests that draw upon long-established artisanship and
            design innovation.
          </Text>
        </Box>
      </Flex>
      <Flex flex="1">
        <ImageBackgroundBox
          mx="auto"
          // url={getImageURL(banner?._id ?? "", storeId, { h: 600 }) ?? ""}
          url={"/images/test.webp"}
          height={["24rem", "36rem", "44rem"]}
          width="100%"
          // @ts-ignore
          style={{ position: "relative" }}
        ></ImageBackgroundBox>
      </Flex>
    </Flex>
  );
};
