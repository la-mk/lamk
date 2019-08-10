import { Typography as AntTypography } from 'antd';
import { BlockProps } from 'antd/lib/typography/Base';
import { TextProps } from 'antd/lib/typography/Text';
import 'antd/lib/typography/style/index.less';

import { system } from '../system';

// @ts-ignore
declare type TitleProps = Omit<
  BlockProps & {
    level?: 1 | 2 | 3 | 4;
  },
  'strong'
>;

export const Text = system<TextProps>(AntTypography.Text as any);
export const Paragraph = system<BlockProps>(AntTypography.Paragraph as any);
export const Title = system<TitleProps>(AntTypography.Title as any);
