import { default as AntTypography, TypographyProps } from 'antd/es/typography';
import 'antd/lib/typography/style/index.less';

import { system } from '../system';

export const Text = system<typeof AntTypography.Text>(
  AntTypography.Text as any,
);
export const Paragraph = system<typeof AntTypography.Paragraph>(
  AntTypography.Paragraph as any,
);
export const Title = system<typeof AntTypography.Title>(
  AntTypography.Title as any,
);
