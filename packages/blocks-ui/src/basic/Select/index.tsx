import React from 'react';
import {
  Select as ChakraSelect,
  SelectProps as ChakraSelectProps,
  As,
  SpaceProps,
} from '@chakra-ui/react';
import { InputSize, InputVariant } from '../../system';

export interface SelectProps
  extends Pick<
      ChakraSelectProps,
      | 'placeholder'
      | 'value'
      | 'autoFocus'
      | 'width'
      | 'isRequired'
      | 'isReadOnly'
      | 'isDisabled'
      | 'isInvalid'
      | 'id'
      | 'name'
      | 'onBlur'
      | 'onFocus'
      | 'onChange'
    >,
    SpaceProps {
  size?: InputSize;
  variant?: InputVariant;
  as?: As;
  isFullWidth?: boolean;
  options: Array<{ label: string; value: string | number }>;
}

export const Select = ({ options, isFullWidth, ...props }: SelectProps) => {
  return (
    <ChakraSelect width={isFullWidth ? '100%' : undefined} {...props}>
      {!!options &&
        options.map(option => {
          return (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          );
        })}
    </ChakraSelect>
  );
};
