import { Box } from "@la-mk/blocks-ui";
import { useTheme } from "@chakra-ui/react";
import React from "react";
import { FinalBlocksTheme } from "@la-mk/blocks-ui/dist/theme";

export const HeadingLine = () => {
  const theme: FinalBlocksTheme = useTheme();
  return (
    <Box
      // @ts-ignore
      border={`3px solid ${theme.colors.background.dark}`}
      mt={2}
      mb={6}
      width={"10%"}
    />
  );
};
