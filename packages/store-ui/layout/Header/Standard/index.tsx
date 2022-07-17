import { Box } from "@la-mk/blocks-ui";
import React from "react";
import { HeaderProps } from "..";
import { SubMenu } from "./SubMenu";
import { Header } from "./Header";

export const FullHeader = ({ sets, categories, ...other }: HeaderProps) => {
  return (
    <Box>
      <Header {...other} />
      <SubMenu sets={sets} categories={categories} />
    </Box>
  );
};
