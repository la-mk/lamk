import { Box, Flex, Heading, Text } from "@la-mk/blocks-ui";
import React from "react";
import { HeadingLine } from "./HeadingLine";

export const BusinessMessage = () => {
  return (
    <Flex my={[8, 8, 9]} px={6} maxWidth="38rem" mx="auto" direction="column">
      <Heading as="h2" size="lg" mb={3}>
        A tribute to quality everyday objects
      </Heading>
      <HeadingLine />
      <Text pl={[3, 4, 5]}>
        We have gathered inspired products from emerging and iconic designers,
        artisans and makers. Fusing form and function, each object was designed
        to bring quality and style to your everyday rituals.
      </Text>
    </Flex>
  );
};
