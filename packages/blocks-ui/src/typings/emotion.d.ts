import '@emotion/react';

import { FinalBlocksTheme } from '../theme';

declare module '@emotion/react' {
  export interface Theme extends FinalBlocksTheme {}
}
