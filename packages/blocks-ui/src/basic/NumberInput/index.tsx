import React from 'react';
import {
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput as ChakraNumberInput,
  NumberInputField,
  NumberInputProps as ChakraNumberInputProps,
  NumberInputStepper,
  SpaceProps,
} from '@chakra-ui/react';
import { InputVariant, InputSize } from '../../system';

export interface NumberInputProps
  extends Pick<
      ChakraNumberInputProps,
      | 'placeholder'
      | 'value'
      // TODO: Check why these are not available
      // | 'autoFocus'
      // | 'isRequired'
      | 'width'
      | 'isFullWidth'
      | 'isReadOnly'
      | 'isDisabled'
      | 'isInvalid'
      | 'id'
      | 'onBlur'
      | 'onFocus'
      | 'onChange'
      | 'max'
      | 'min'
      | 'precision'
      | 'step'
    >,
    SpaceProps {
  size?: InputSize;
  variant?: InputVariant;
  prefix?: string;
  suffix?: string;
}

ChakraNumberInput.defaultProps = {};

export const NumberInput = ({
  suffix,
  prefix,
  value,
  onChange,
  ...props
}: NumberInputProps) => {
  const formatted = React.useMemo(() => {
    return prefix || suffix
      ? `${prefix ?? ''} ${value ?? ''} ${suffix ?? ''}`.trim()
      : value;
  }, [value, prefix, suffix]);

  const parsedOnChange = React.useCallback(
    (val: string) => {
      const cleaned = (val || '').toString().replace(/[^0-9.]/g, '');
      const resp = parseInt(cleaned);
      if (isNaN(resp)) {
        // @ts-ignore
        return onChange?.(undefined, undefined);
      }

      onChange?.(cleaned, resp);
    },
    [onChange]
  );

  return (
    <ChakraNumberInput {...props} value={formatted} onChange={parsedOnChange}>
      <NumberInputField />
      <NumberInputStepper>
        <NumberIncrementStepper />
        <NumberDecrementStepper />
      </NumberInputStepper>
    </ChakraNumberInput>
  );
};
