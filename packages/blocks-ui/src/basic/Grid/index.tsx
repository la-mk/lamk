import {
  SimpleGrid as ChakraSimpleGrid,
  SimpleGridProps as ChakraSimpleGridProps,
  SpaceProps,
} from '@chakra-ui/react';

export interface GridProps
  extends Pick<
      ChakraSimpleGridProps,
      'minChildWidth' | 'columns' | 'spacing' | 'spacingX' | 'spacingY'
    >,
    SpaceProps {}

export const Grid = ChakraSimpleGrid as React.FunctionComponent<GridProps>;
