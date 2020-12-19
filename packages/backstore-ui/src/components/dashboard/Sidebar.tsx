import { Button, Flex, Text } from '@sradevski/blocks-ui';
import React from 'react';
import { Link } from 'react-router-dom';

interface SidebarProps {
  currentKey?: string;
  isCollapsed?: boolean;
  items: Array<{
    href: string;
    title: string;
    icon: (props: any) => React.ReactElement;
  }>;
}

export const Sidebar = ({ isCollapsed, currentKey, items }: SidebarProps) => {
  return (
    <Flex direction='column'>
      {items.map(item => {
        return (
          <Link to={item.href}>
            <Button
              // @ts-ignore
              borderRadius={'none'}
              // @ts-ignore
              fontSize={'sm'}
              // @ts-ignore
              color='mutedText.light'
              // @ts-ignore
              justifyContent={isCollapsed ? 'center' : 'flex-start'}
              isFullWidth
              variant={currentKey?.includes(item.href) ? 'solid' : 'ghost'}
              my={2}
              as='a'
              leftIcon={item.icon?.({
                style: {
                  fontSize: isCollapsed ? '20px' : undefined,
                  marginRight: isCollapsed ? 0 : undefined,
                },
              })}
            >
              <Text
                color='mutedText.light'
                display={isCollapsed ? 'none' : undefined}
              >
                {item.title}
              </Text>
            </Button>
          </Link>
        );
      })}
    </Flex>
  );
};
