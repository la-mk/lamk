import React from 'react';

import {
  Accordion as ChakraAccordion,
  AccordionPanel as ChakraAccordionPanel,
  AccordionItem as ChakraAccordionItem,
  AccordionButton as ChakraAccordionButton,
  AccordionIcon as ChakraAccordionIcon,
  SpaceProps,
  LayoutProps,
} from '@chakra-ui/react';
import { Box } from '../Box';

export type AccordionProps = SpaceProps & {
  display?: LayoutProps['display'];
} & {
  items: Array<{
    title: string;
    content: React.ReactNode;
  }>;
};

export const Accordion = ({ items }: AccordionProps) => {
  return (
    <ChakraAccordion allowMultiple allowToggle>
      {items.map(item => {
        return (
          <ChakraAccordionItem key={item.title}>
            <ChakraAccordionButton>
              <Box color="inherit" textAlign="start" flex={1}>
                {item.title}
              </Box>
              <ChakraAccordionIcon />
            </ChakraAccordionButton>
            <ChakraAccordionPanel pb={4}>{item.content}</ChakraAccordionPanel>
          </ChakraAccordionItem>
        );
      })}
    </ChakraAccordion>
  );
};
