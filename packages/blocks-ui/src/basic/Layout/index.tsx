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
    [leftSider content] minmax(0, 1fr)
    ${footer ? '[footer footer] max-content' : ''}
  `;

  const templateColumns = '[leftSider] max-content [content] minmax(0, 1fr)';

  return (
    <Grid
      bg="transparent"
      height="100%"
      gridTemplateAreas={templateAreas.trim()}
      gridTemplateRows={templateRows.trim()}
      gridTemplateColumns={templateColumns}
    >
      {header && (
        <GridItem bg="transparent" gridRow="header" gridColumn="header">
          {header}
        </GridItem>
      )}
      {leftSider && (
        <GridItem bg="transparent" gridRow="leftSider" gridColumn="leftSider">
          {leftSider}
        </GridItem>
      )}
      {footer && (
        <GridItem bg="transparent" gridRow="footer" gridColumn="footer">
          {footer}
        </GridItem>
      )}
      <GridItem
        bg="transparent"
        gridRow={leftSider ? 'leftSider' : 'content'}
        gridColumn="content"
      >
        {children}
      </GridItem>
    </Grid>
  );
};
