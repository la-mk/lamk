import React from 'react';
import {
  Textarea as ChakraTextarea,
  TextareaProps as ChakraTextareaProps,
  SpaceProps,
} from '@chakra-ui/react';
import { Size } from '../../system';

export interface TextareaProps
  extends Pick<
      ChakraTextareaProps,
      | 'rows'
      | 'resize'
      | 'placeholder'
      | 'value'
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
  size?: Size;
}

ChakraTextarea.defaultProps = {};

export const Textarea = ChakraTextarea as React.FunctionComponent<
  TextareaProps
>;
