import {
  Divider as ChakraDivider,
  DividerProps as ChakraDividerProps,
  SpaceProps,
} from '@chakra-ui/react';

export interface DividerProps
  extends Pick<ChakraDividerProps, 'orientation' | 'display'>,
    SpaceProps {}

ChakraDivider.defaultProps = {};

export const Divider = ChakraDivider as React.FunctionComponent<DividerProps>;
