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

import { Plus, X } from 'react-feather';

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
    <ChakraTabs colorScheme="primary" {...props}>
      <ChakraTabList>
        {items.map((item, index) => {
          return (
            <ChakraTab key={index}>
              {item.title}
              {item.isClosable && onRemove && (
                <Button
                  variant="link"
                  ml={3}
                  onClick={() => onRemove(index)}
                  leftIcon={<X size="1.2rem" />}
                ></Button>
              )}
            </ChakraTab>
          );
        })}
        {isExpandable && onAdd && (
          <Button
            mx={2}
            variant="ghost"
            onClick={onAdd}
            leftIcon={<Plus size="1.2rem" />}
          />
        )}
      </ChakraTabList>

      <ChakraTabsPanels mt={4}>
        {items.map((item, i) => {
          return <ChakraTabPanel key={i}>{item.content}</ChakraTabPanel>;
        })}
      </ChakraTabsPanels>
    </ChakraTabs>
  );
};
