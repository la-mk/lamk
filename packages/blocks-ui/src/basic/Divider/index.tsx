import {
  Divider as ChakraDivider,
  DividerProps as ChakraDividerProps,
  SpaceProps,
  BorderProps,
} from '@chakra-ui/react';

// TODO: PR to export this as well
import { DisplayProps } from 'styled-system';

export interface DividerProps
  extends Pick<ChakraDividerProps, 'orientation'>,
    SpaceProps,
    DisplayProps,
    Pick<BorderProps, 'borderColor'> {}

ChakraDivider.defaultProps = {};

export const Divider = ChakraDivider as React.FunctionComponent<DividerProps>;
