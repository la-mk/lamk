import React from 'react';
import {
  Radio as ChakraRadio,
  RadioGroup as ChakraRadioGroup,
  RadioProps as ChakraRadioProps,
  SpaceProps,
} from '@chakra-ui/react';
import { InputSize } from '../../system';

export interface RadioProps
  extends Pick<
      ChakraRadioProps,
      // | 'autoFocus'
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
  options: Array<{
    children: React.ReactNode;
    value: string | number;
  }>;
}

ChakraRadio.defaultProps = {};

export const Radio = ({ options, name, ...props }: RadioProps) => {
  return (
    <ChakraRadioGroup name={name}>
      {options.map((option, idx) => {
        return (
          <ChakraRadio
            {...props}
            ml={idx > 0 ? 4 : 0}
            key={option.value}
            value={option.value}
          >
            {option.children}
          </ChakraRadio>
        );
      })}
    </ChakraRadioGroup>
  );
};
