import React from 'react';

import {
  Tabs as ChakraTabs,
  TabList as ChakraTabList,
  TabPanels as ChakraTabsPanels,
  Tab as ChakraTab,
  TabPanel as ChakraTabPanel,
  TabsProps as ChakraTabsProps,
  SpaceProps,
} from '@chakra-ui/react';

import { PlusOutlined, CloseOutlined } from '@ant-design/icons';

import { Size } from '../../system';
import { Button } from '../Button';

export interface TabsProps
  extends Pick<ChakraTabsProps, 'onChange' | 'index'>,
    SpaceProps {
  items: Array<{
    title: string;
    content: React.ReactNode;
    isClosable?: boolean;
  }>;
  isExpandable?: boolean;
  onAdd?: () => void;
  onRemove?: (index: number) => void;
  size?: Size;
}

// ChakraTabs.defaultProps = {};

export const Tabs = ({
  items,
  isExpandable,
  onAdd,
  onRemove,
  ...props
}: TabsProps) => {
  return (
    <ChakraTabs {...props}>
      <ChakraTabList>
        {items.map((item, index) => {
          return (
            <ChakraTab>
              {item.title}
              {item.isClosable && onRemove && (
                <Button variant="link" ml={3} onClick={() => onRemove(index)}>
                  <CloseOutlined />
                </Button>
              )}
            </ChakraTab>
          );
        })}
        {isExpandable && onAdd && (
          <Button mx={2} variant="ghost" onClick={onAdd}>
            <PlusOutlined />
          </Button>
        )}
      </ChakraTabList>

      <ChakraTabsPanels>
        {items.map(item => {
          return <ChakraTabPanel>{item.content}</ChakraTabPanel>;
        })}
      </ChakraTabsPanels>
    </ChakraTabs>
  );
};
