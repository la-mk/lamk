import { default as AntTypography } from 'antd/es/typography';
import { BlockProps } from 'antd/es/typography/Base';
import { TextProps } from 'antd/es/typography/Text';
import 'antd/lib/typography/style/index.less';

import { system } from '../system';

declare type TitleProps = Omit<
  BlockProps & {
    level?: 1 | 2 | 3 | 4;
  },
  'strong'
>;

export const Text = system<TextProps>(AntTypography.Text as any);
export const Paragraph = system<BlockProps>(AntTypography.Paragraph as any);
export const Title = system<TitleProps>(AntTypography.Title as any);
