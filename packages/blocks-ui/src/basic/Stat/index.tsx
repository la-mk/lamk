import React from 'react';
import {
  Stat as ChakraStat,
  StatLabel,
  StatNumber,
  StatHelpText,
  SpaceProps,
} from '@chakra-ui/react';

export interface StatProps extends SpaceProps {
  label: string;
  value: string;
  description?: string;
}

export const Stat = ({ label, value, description, ...props }: StatProps) => {
  return (
    <ChakraStat {...props}>
      <StatLabel>{label}</StatLabel>
      <StatNumber>{value}</StatNumber>
      {description && <StatHelpText>{description}</StatHelpText>}
    </ChakraStat>
  );
};
