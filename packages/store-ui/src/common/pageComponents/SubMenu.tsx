import React from 'react';
import { Flex, Text, Menu, MenuItem, Dropdown } from '@sradevski/blocks-ui';
import { withTheme } from 'styled-components';
import Link from 'next/link';
import { DownOutlined } from '@ant-design/icons';
import { CategoriesMenu } from '../../components/shared/CategoriesMenu';

export const SubMenu = withTheme(({ theme, ...otherProps }) => {
  return (
    <Flex
      {...otherProps}
      width='100%'
      style={{ backgroundColor: theme.colors.background.dark }}
      flexDirection='row'
      alignItems='center'
      justifyContent='flex-start'
    >
      <Menu
        px={[2, 3, 4]}
        style={{
          borderBottom: 'none',
          lineHeight: '46px',
          background: 'transparent',
        }}
        mode='horizontal'
      >
        <MenuItem
          style={{ borderBottom: 0 }}
          p={0}
          mx={[3, 4, 5]}
          key='products'
        >
          <Link href='/products' passHref>
            <Text color='text.light'>Sale Items</Text>
          </Link>
        </MenuItem>

        <MenuItem
          style={{ borderBottom: 0 }}
          p={0}
          mx={[3, 4, 5]}
          key='products'
        >
          <Link href='/products' passHref>
            <Text color='text.light'>New Arrivals</Text>
          </Link>
        </MenuItem>

        <MenuItem
          style={{ borderBottom: 0 }}
          p={0}
          mx={[3, 4, 5]}
          key='products'
        >
          <Dropdown
            trigger={['click', 'hover']}
            placement='bottomLeft'
            overlay={<CategoriesMenu mode='horizontal' />}
          >
            <Text color='text.light'>
              Categories
              <DownOutlined
                style={{ margin: 0, marginLeft: 8, fontSize: '0.8em' }}
              />
            </Text>
          </Dropdown>
        </MenuItem>
      </Menu>
    </Flex>
  );
});
