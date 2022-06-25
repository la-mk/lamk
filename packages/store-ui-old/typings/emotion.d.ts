import '@emotion/react';

import { FinalBlocksTheme } from '@la-mk/blocks-ui/dist/theme';

declare module '@emotion/react' {
  export interface Theme extends FinalBlocksTheme {}
}
