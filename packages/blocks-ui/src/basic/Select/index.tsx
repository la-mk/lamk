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
      | 'isFullWidth'
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
  options: Array<{ label: string; value: string | number }>;
}

export const Select = ({ options, ...props }: SelectProps) => {
  return (
    <ChakraSelect {...props}>
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
