import React from 'react';
import {
  Menu,
  Layout,
  Content,
  Header,
  Footer,
  Image,
  Flex,
} from '@sradevski/blocks-ui';
import styled from 'styled-components';
import Link from 'next/link';

interface StoreLayoutProps {
  children?: React.ReactNode;
}

// This makes sure the anchor is as high as its content
const LineHeightFreeAnchor = styled.a`
  line-height: 0;
  height: 56px;
  min-width: 56px;
  margin: 4px 0;
`;

export const LandingLayout = ({ children }: StoreLayoutProps) => {
  return (
    <>
      <Layout>
        <Header style={{ backgroundColor: 'white' }}>
          <Flex justifyContent='space-between'>
            <Link href='/' passHref>
              <LineHeightFreeAnchor style={{ display: 'flex' }}>
                <Image maxHeight='100%' src={'/some/path'} alt='logo' />
              </LineHeightFreeAnchor>
            </Link>

            <Menu mode='horizontal' defaultSelectedKeys={['2']}>
              <Menu.Item key='1'>Како функционира</Menu.Item>
              <Menu.Item key='2'>ЧПП</Menu.Item>
              <Menu.Item key='3'>Контакт</Menu.Item>
            </Menu>
          </Flex>
        </Header>
        <Content style={{ backgroundColor: 'white' }}>{children}</Content>
        <Footer style={{ textAlign: 'center' }}>
          Ant Design ©2018 Created by Ant UED
        </Footer>
      </Layout>
    </>
  );
};
