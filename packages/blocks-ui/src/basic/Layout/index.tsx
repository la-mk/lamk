import React from 'react';
import { Grid, GridItem } from '@chakra-ui/react';

export interface LayoutProps {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  leftSider?: React.ReactNode;
  children: React.ReactNode;
}

export const Layout = ({
  header,
  footer,
  leftSider,
  children,
}: LayoutProps) => {
  const templateAreas = `
    ${header ? '"header header"' : ''}
    "leftSider content"
    ${footer ? '"footer footer"' : ''};
  `;

  const templateRows = `
    ${header ? '[header header] max-content' : ''}
    [leftSider content] 1fr
    ${footer ? '[footer footer] max-content' : ''}
  `;

  const templateColumns = '[leftSider] max-content [content] 1fr';

  return (
    <Grid
      height="100%"
      gridTemplateAreas={templateAreas.trim()}
      gridTemplateRows={templateRows.trim()}
      gridTemplateColumns={templateColumns}
    >
      {header && (
        <GridItem gridRow="header" gridColumn="header">
          {header}
        </GridItem>
      )}
      {leftSider && (
        <GridItem gridRow="leftSider" gridColumn="leftSider">
          {leftSider}
        </GridItem>
      )}
      {footer && (
        <GridItem gridRow="footer" gridColumn="footer">
          {footer}
        </GridItem>
      )}
      <GridItem
        gridRow={leftSider ? 'leftSider' : 'content'}
        gridColumn="content"
      >
        {children}
      </GridItem>
    </Grid>
  );
};
