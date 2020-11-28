import React from 'react';
import {
  Switch as ChakraSwitch,
  SwitchProps as ChakraSwitchProps,
  SpaceProps,
  FormLabel,
  FormControl,
} from '@chakra-ui/react';
import { InputSize } from '../../system';

export interface SwitchProps
  extends Pick<
      ChakraSwitchProps,
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

ChakraSwitch.defaultProps = {};

export const Switch = ({ children, id, ...props }: SwitchProps) => {
  const switchId = React.useMemo(() => id ?? Math.random().toString(), [id]);

  return (
    <FormControl display="flex" alignItems="center">
      <ChakraSwitch id={switchId} {...props} />
      <FormLabel ml={2} htmlFor={switchId} mb="0">
        {children}
      </FormLabel>
    </FormControl>
  );
};
