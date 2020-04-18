import { Typography as AntTypography } from 'antd';
import { BlockProps } from 'antd/es/typography/Base';
import { TextProps } from 'antd/es/typography/Text';
import 'antd/es/typography/style/index.less';

import { system } from '../system';

// @ts-ignore
declare type TitleProps = Omit<
  BlockProps & {
    level?: 1 | 2 | 3 | 4;
  },
  'strong'
>;

export const Text = system<TextProps>(AntTypography.Text as any, ['color', 'textAlign', 'fontSize']);
export const Paragraph = system<BlockProps>(AntTypography.Paragraph as any, ['color', 'textAlign', 'fontSize']);
export const Title = system<TitleProps>(AntTypography.Title as any, ['color', 'textAlign', 'fontSize']);
