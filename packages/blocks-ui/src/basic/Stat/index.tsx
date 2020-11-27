import React from 'react';
import {
  Stat as ChakraStat,
  StatLabel,
  StatNumber,
  StatHelpText,
  SpaceProps,
} from '@chakra-ui/react';

export interface StatProps extends SpaceProps {
  title: string;
  value: string;
  description?: string;
}

export const Stat = ({ title, value, description, ...props }: StatProps) => {
  return (
    <ChakraStat {...props}>
      <StatLabel>{title}</StatLabel>
      <StatNumber>{value}</StatNumber>
      {description && <StatHelpText>{description}</StatHelpText>}
    </ChakraStat>
  );
};
