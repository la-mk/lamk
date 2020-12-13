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

export interface TreeviewEntry {
  title: string;
  key: string;
  children?: TreeviewEntry[];
}

export interface TreeviewProps extends SpaceProps {
  items: TreeviewEntry[];
  selected?: string[];
  onSelect?: (selected: string[]) => void;
}

export const Treeview = ({
  items,
  selected,
  onSelect,
  ...props
}: TreeviewProps) => {
  const selectedSet = React.useMemo(() => {
    return new Set(selected);
  }, [selected]);

  return (
    <ChakraAccordion allowMultiple allowToggle {...props}>
      {items.map(item => {
        if (!item.children) {
          return (
            <Box pl={6} mb={2}>
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
            </Box>
          );
        }

        return (
          <ChakraAccordionItem p={0} pl={5} pb={1} border={0} key={item.key}>
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
              />
            </ChakraAccordionPanel>
          </ChakraAccordionItem>
        );
      })}
    </ChakraAccordion>
  );
};
