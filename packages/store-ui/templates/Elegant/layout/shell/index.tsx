import { Box, Flex } from "@la-mk/blocks-ui";
import React from "react";
import { ShellProps } from "../../../../containers/layout/Shell";

export const Shell = ({ children }: ShellProps) => {
  return (
    <Box flex={1} minHeight="calc(100vh - 120px)" maxWidth={"100%"}>
      <div id="categories-portal-root" />
      <Flex minHeight={"inherit"} direction="column">
        {children}
      </Flex>
    </Box>
  );
};
