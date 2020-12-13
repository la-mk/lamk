import React from 'react';
import {
  Badge as ChakraBadge,
  BadgeProps as ChakraBadgeProps,
  As,
  SpaceProps,
} from '@chakra-ui/react';
import { BadgeVariant, Size } from '../../system';

export interface BadgeProps
  extends Pick<ChakraBadgeProps, 'children' | 'colorScheme' | 'borderRadius'>,
    SpaceProps {
  size?: Size;
  as?: As;
  variant?: BadgeVariant;
}

export const Badge = ({ children, size, ...props }: BadgeProps) => {
  return (
    <ChakraBadge fontSize={size} {...props}>
      {children}
    </ChakraBadge>
  );
};
