import React from 'react';
import { Text } from '../../basic/Text';
import { Heading } from '../../basic/Heading';
import { Button } from '../../basic/Button';
import { Flex } from '../../basic/Flex';
import { Box } from '../../basic/Box';
import { Accordion } from '../../basic/Accordion';

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
    <Flex width="100%" direction="column" align="center">
      {submenus.map(submenu => {
        return (
          <Link key={submenu.link} href={submenu.link} passHref>
            <Button as="a" my={3} variant="link">
              <Text size="sm" color="text.light">
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
    <Heading mx={3} mb={4} size="sm" color="text.light" as="h4">
      {menu.text.toUpperCase()}
    </Heading>
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
              <Flex direction="column" align="center" key={menu.text} mx={4}>
                <SubmenuTitle Link={Link} menu={menu} />
                <Submenu Link={Link} submenus={menu.submenus} />
              </Flex>
            );
          })}
        </Flex>
      </Box>

      <Box width="100%" my={[4, 4, 0]} display={['block', 'block', 'none']}>
        <Accordion
          items={menus.map(menu => ({
            title: menu.text,
            content: <Submenu Link={Link} submenus={menu.submenus} />,
          }))}
        />
      </Box>
    </>
  );
};
