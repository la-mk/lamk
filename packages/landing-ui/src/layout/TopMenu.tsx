import React from 'react';
import { Menu, MenuItem, Button, hooks } from '@sradevski/blocks-ui';
import Link from 'next/link';
import { useRouter } from 'next/router';

export const TopMenu = ({ theme }) => {
  const mode = hooks.useBreakpoint(['vertical', 'horizontal', 'horizontal']);
  const router = useRouter();
  // Not a very clean solution, but it will do for now
  const matches = router.pathname.match(/\/([^/]*)(\/?)/);
  const selectedKeys = matches && !!matches[1] ? [matches[1]] : ['home'];

  return (
    <Menu
      style={{
        border: 'none',
        backgroundColor: theme.colors.lightBackground,
      }}
      mode={mode}
      selectedKeys={selectedKeys}
    >
      <MenuItem p={0} key='home' mb={11} mx={[0, 1, 2]}>
        <Link href='/' passHref>
          <Button type='link'>Дома</Button>
        </Link>
      </MenuItem>
      <MenuItem p={0} key='how-it-works' mb={11} mx={[0, 1, 2]}>
        <Link href='/how-it-works' passHref>
          <Button type='link'>Како функционира</Button>
        </Link>
      </MenuItem>
      <MenuItem p={0} key='faq' mb={11} mx={[0, 1, 2]}>
        <Link href='/faq' passHref>
          <Button type='link'>ЧПП</Button>
        </Link>
      </MenuItem>
      <MenuItem p={0} key='contact' mb={11} mx={[0, 1, 2]}>
        <Link href='/contact' passHref>
          <Button type='link'>Контакт</Button>
        </Link>
      </MenuItem>

      <MenuItem
        p={0}
        key='start-now'
        style={{ border: 'none' }}
        mb={11}
        mx={[0, 1, 2]}
      >
        <Link href='/' passHref>
          <Button style={{ color: 'white' }} type='primary'>
            Почнете сега
          </Button>
        </Link>
      </MenuItem>
    </Menu>
  );
};
