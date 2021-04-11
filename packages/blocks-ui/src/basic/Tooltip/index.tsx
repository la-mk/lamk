import {
  Tooltip as ChakraTooltip,
  TooltipProps as ChakraTooltipProps,
} from '@chakra-ui/react';

export type TooltipProps = Pick<ChakraTooltipProps, 'children' | 'label'>;

ChakraTooltip.defaultProps = {
  closeDelay: 100,
  openDelay: 250,
  colorScheme: 'blackAlpha',
  hasArrow: true,
};

export const Tooltip = ChakraTooltip as React.FunctionComponent<TooltipProps>;
