import { Box, Flex } from "@la-mk/blocks-ui";
import React from "react";
import { ShellProps } from "../../../../containers/layout/Shell";

export const Shell = ({ children }: ShellProps) => {
  return (
    <Box flex={1} mb={7} minHeight="calc(100vh - 200px)" maxWidth={"100%"}>
      <div id="categories-portal-root" />
      <Flex direction="column">{children}</Flex>
    </Box>
  );
};
