import React from 'react';

import {
  Accordion as ChakraAccordion,
  AccordionPanel as ChakraAccordionPanel,
  AccordionItem as ChakraAccordionItem,
  AccordionButton as ChakraAccordionButton,
  AccordionIcon as ChakraAccordionIcon,
  SpaceProps,
} from '@chakra-ui/react';
import { Box } from '../Box';
import { Checkbox } from '../Checkbox';
import { Button } from '../Button';
import { Text } from '../Text';

export interface TreeviewEntry {
  title: string;
  key: string;
  children?: TreeviewEntry[];
}

export interface TreeviewProps extends SpaceProps {
  items: TreeviewEntry[];
  selected?: string[];
  onSelect?: (selected: string[]) => void;
  itemPadding?: number;
  multiple?: boolean;
}

export const Treeview = ({
  items,
  selected,
  onSelect,
  itemPadding = 0,
  multiple,
  ...props
}: TreeviewProps) => {
  const selectedSet = React.useMemo(() => {
    return new Set(selected);
  }, [selected]);

  return (
    <ChakraAccordion allowMultiple allowToggle {...props}>
      {items.map((item, i) => {
        if (!item.children) {
          return (
            <Box key={i} pl={6} mb={2}>
              {multiple ? (
                <Checkbox
                  isChecked={selectedSet.has(item.key)}
                  onChange={e => {
                    const isNewChecked = e.target.checked;
                    if (isNewChecked) {
                      onSelect?.([...(selected ?? []), item.key]);
                    } else {
                      onSelect?.(selected?.filter(x => x !== item.key) ?? []);
                    }
                  }}
                >
                  {item.title}
                </Checkbox>
              ) : (
                <Button
                  variant="link"
                  onClick={() => {
                    if (selectedSet.has(item.key)) {
                      onSelect?.([]);
                    } else {
                      onSelect?.([item.key]);
                    }
                  }}
                >
                  {
                    <Text
                      color={
                        selectedSet.has(item.key) ? 'primary.500' : 'text.dark'
                      }
                    >
                      {item.title}
                    </Text>
                  }
                </Button>
              )}
            </Box>
          );
        }

        return (
          <ChakraAccordionItem
            p={0}
            pl={itemPadding}
            pb={1}
            border={0}
            key={item.key}
          >
            <ChakraAccordionButton>
              <Box color="inherit" textAlign="start" flex={1}>
                {item.title}
              </Box>
              <ChakraAccordionIcon />
            </ChakraAccordionButton>
            <ChakraAccordionPanel px={0} pb={1}>
              <Treeview
                items={item.children}
                selected={selected}
                onSelect={onSelect}
                itemPadding={5}
              />
            </ChakraAccordionPanel>
          </ChakraAccordionItem>
        );
      })}
    </ChakraAccordion>
  );
};
