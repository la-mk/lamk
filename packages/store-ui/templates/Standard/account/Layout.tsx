import { Box, Flex } from "@la-mk/blocks-ui";
import React from "react";
import { AccountLayoutProps } from "../../../containers/account/Layout";
import { AccountMenu } from "./AccountMenu";

export const Layout = ({ children, user }: AccountLayoutProps) => {
  return (
    <Flex
      // @ts-ignore
      style={{ position: "relative" }}
      minHeight={"inherit"}
      direction="row"
    >
      <Box
        // @ts-ignore
        style={{ position: "absolute" }}
        display={["none", "block", "block"]}
        height="100%"
        width={["100%", "14rem", "14rem"]}
      >
        <AccountMenu user={user} />
      </Box>
      <Box mb={7} ml={["none", "14rem", "14rem"]} flex={1}>
        {children}
      </Box>
    </Flex>
  );
};
