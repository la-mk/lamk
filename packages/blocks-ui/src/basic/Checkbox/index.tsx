import {
  Checkbox as ChakraCheckbox,
  CheckboxProps as ChakraCheckboxProps,
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
    >,
    SpaceProps {
  size?: InputSize;
}

ChakraCheckbox.defaultProps = {};

export const Checkbox = ChakraCheckbox as React.FunctionComponent<
  CheckboxProps
>;
