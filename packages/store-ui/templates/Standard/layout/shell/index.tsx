import { Box, Flex } from "@la-mk/blocks-ui";
import React from "react";
import { ShellProps } from "../../../../containers/layout/Shell";
import { AccountMenu } from "../../account/AccountMenu";

export const Shell = ({ children, user, isInAccountsPage }: ShellProps) => {
  return (
    // @ts-ignore
    <Flex style={{ position: "relative " }} direction="row">
      {isInAccountsPage ? (
        <Box
          // @ts-ignore
          style={{ position: "absolute" }}
          display={["none", "block", "block"]}
          height="100%"
          width={["100%", "14rem", "14rem"]}
        >
          <AccountMenu user={user} />
        </Box>
      ) : null}
      <Box
        ml={isInAccountsPage ? ["none", "14rem", "14rem"] : undefined}
        flex={1}
        mb={7}
        minHeight="calc(100vh - 200px)"
        maxWidth={"100%"}
      >
        <div id="categories-portal-root" />
        <Flex direction="column">{children}</Flex>
      </Box>
    </Flex>
  );
};
