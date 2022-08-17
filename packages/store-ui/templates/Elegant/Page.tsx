import React from "react";
import { Flex, Heading, Box } from "@la-mk/blocks-ui";

interface PageProps {
  title?: string;
  maxWidth?: number | string;
  children: React.ReactNode;
}

export const Page = ({ title, maxWidth, children }: PageProps) => {
  return (
    <Flex
      direction="column"
      justify="flex-start"
      width="100%"
      maxWidth={maxWidth ?? 1920}
      mb={7}
      mx="auto"
      overflow="hidden"
    >
      {title && (
        <Heading mx="auto" my={7} size={"xl"} as="h1">
          {title}
        </Heading>
      )}
      <Box width={"100%"} mx="auto">
        {children}
      </Box>
    </Flex>
  );
};
