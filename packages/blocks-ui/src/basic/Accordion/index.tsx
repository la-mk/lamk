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

export interface AccordionProps extends SpaceProps {
  items: Array<{
    title: string;
    content: React.ReactNode;
  }>;
}

ChakraAccordion.defaultProps = {
  allowMultiple: true,
  allowToggle: true,
};

export const Accordion = ({ items }: AccordionProps) => {
  return (
    <ChakraAccordion>
      {items.map(item => {
        return (
          <ChakraAccordionItem>
            <ChakraAccordionButton>
              <Box textAlign="start" flex={1}>
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
