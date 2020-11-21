import React from 'react';
import { CollapsePanel, Collapse } from '../../basic/Collapse';
import { Text, Title } from '../../basic/Typography';
import { Button } from '../../basic/Button';
import { Flex } from '../../basic/Flex';
import { Box } from '../../basic/Box';
import styled from 'styled-components';

export interface Menu {
  text: string;
  link?: string;
  submenus: Array<Submenu>;
}

export interface Submenu {
  link: string;
  text: string;
}

const Submenu = ({ submenus, Link }: { submenus: Submenu[]; Link: any }) => {
  return (
    <Flex width="100%" flexDirection="column" alignItems="center">
      {submenus.map(submenu => {
        return (
          <Link key={submenu.link} href={submenu.link} passHref>
            <Button my={2} variant="link">
              <Text fontSize={0} color="text.light">
                {submenu.text}
              </Text>
            </Button>
          </Link>
        );
      })}
    </Flex>
  );
};

const SubmenuTitle = ({ menu, Link }: { menu: Menu; Link: any }) => {
  const title = (
    <Title mx={3} mb={3} fontSize={1} color="text.light" level={4}>
      {menu.text.toUpperCase()}
    </Title>
  );
  return (
    <>
      {menu.link && (
        <Link key={menu.link} href={menu.link}>
          <a style={{ textDecoration: 'none' }}>{title}</a>
        </Link>
      )}
      {!menu.link && title}
    </>
  );
};

const CollapsePanelContainer = styled(Box)`
  & .ant-collapse-arrow {
    color: ${props => props.theme.colors.text.light} !important;
  }
`;

export const FooterContent = ({
  menus,
  Link,
}: {
  menus: Menu[];
  Link: any;
}) => {
  return (
    <>
      <Box mt={[3, 0, 0]} display={['none', 'none', 'flex']}>
        <Flex>
          {menus.map(menu => {
            return (
              <Flex
                flexDirection="column"
                alignItems="center"
                key={menu.text}
                mx={4}
              >
                <SubmenuTitle Link={Link} menu={menu} />
                <Submenu Link={Link} submenus={menu.submenus} />
              </Flex>
            );
          })}
        </Flex>
      </Box>

      <CollapsePanelContainer
        width="100%"
        my={[4, 4, 0]}
        display={['block', 'block', 'none']}
      >
        <Collapse
          bordered={false}
          style={{
            background: 'transparent',
          }}
        >
          {menus.map(menu => {
            return (
              <CollapsePanel
                key={menu.text}
                header={<Text color="text.light">{menu.text}</Text>}
              >
                <Submenu Link={Link} submenus={menu.submenus} />
              </CollapsePanel>
            );
          })}
        </Collapse>
      </CollapsePanelContainer>
    </>
  );
};
