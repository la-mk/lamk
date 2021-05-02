import {
  Checkbox as ChakraCheckbox,
  CheckboxGroup as ChakraCheckboxGroup,
  CheckboxProps as ChakraCheckboxProps,
  CheckboxGroupProps as ChakraCheckboxGroupProps,
  SpaceProps,
} from '@chakra-ui/react';
import { InputSize } from '../../system';

export interface CheckboxProps
  extends Pick<
      ChakraCheckboxProps,
      | 'isChecked'
      | 'children'
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
      | 'value'
    >,
    SpaceProps {
  size?: InputSize;
}

export interface CheckboxGroupProps
  extends Pick<
    ChakraCheckboxGroupProps,
    'value' | 'isDisabled' | 'onChange' | 'size' | 'children'
  > {}

export const CheckboxGroup = ChakraCheckboxGroup as React.FunctionComponent<
  CheckboxGroupProps
>;

export const Checkbox = ChakraCheckbox as React.FunctionComponent<
  CheckboxProps
>;
