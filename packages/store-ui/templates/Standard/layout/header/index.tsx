import { Box } from "@la-mk/blocks-ui";
import React from "react";
import { SubMenu } from "./SubMenu";
import { Header as HeaderBase } from "./Header";
import { HeaderProps } from "../../../../containers/layout/Header";

export const Header = ({ sets, categories, ...other }: HeaderProps) => {
  return (
    <Box>
      <HeaderBase {...other} />
      <SubMenu sets={sets} categories={categories} />
    </Box>
  );
};
