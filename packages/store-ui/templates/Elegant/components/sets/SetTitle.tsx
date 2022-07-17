import React from "react";
import { Heading, Text, Flex } from "@la-mk/blocks-ui";

export const SetTitle = ({
  emphasized,
  title,
  subtitle,
}: {
  emphasized?: boolean;
  title: string;
  subtitle?: string;
}) => {
  return (
    <Flex mb={[5, 6, 7]} align="center" justify="center" direction="column">
      <Heading align="center" mb={1} as="h2" size={emphasized ? "xl" : "lg"}>
        {title}
      </Heading>
      {subtitle && (
        <Text align="center" size={"lg"} color="mutedText.dark">
          {subtitle}
        </Text>
      )}
    </Flex>
  );
};
