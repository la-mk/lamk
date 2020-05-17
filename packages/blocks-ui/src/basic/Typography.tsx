import React from 'react';
import { Typography as AntTypography } from 'antd';
import { BlockProps } from 'antd/es/typography/Base';
import { TextProps } from 'antd/es/typography/Text';
import 'antd/es/typography/style/index.less';

import { system, SystemProps } from '../system';
import { ParagraphProps } from 'antd/lib/typography/Paragraph';

// @ts-ignore
declare type TitleProps = Omit<
  BlockProps & {
    level?: 1 | 2 | 3 | 4;
  },
  'strong'
>;

const getTitleFontSize = (level: TitleProps['level']) => {
  switch (level) {
    case 1:
      return 7;
    case 2:
      return 6;
    case 3:
      return 5;
    case 4:
      return 4;
    default:
      return 7;
  }
};

export const BaseText = system<TextProps>(AntTypography.Text as any, [
  'color',
  'textAlign',
  'fontSize',
]);

export const BaseParagraph = system<BlockProps>(
  AntTypography.Paragraph as any,
  ['color', 'textAlign', 'fontSize']
);

const BaseTitle = system<TitleProps>(AntTypography.Title as any, [
  'color',
  'textAlign',
  'fontSize',
]);

// Omit type, use `color` instead.
export const Text = (props: Omit<TextProps, "type"> & SystemProps) => {
  return <BaseText color="text.dark" fontSize={1} {...props} />;
};

export const Paragraph = (props: Omit<ParagraphProps, "type"> & SystemProps) => {
  return <BaseParagraph color="text.dark" fontSize={1} {...props} />;
};

export const Title = ({ style, ...props }: Omit<TitleProps, "type"> & SystemProps) => {
  return (
    <BaseTitle
      color="text.dark"
      fontSize={getTitleFontSize(props.level)}
      style={{ fontWeight: 400, ...style }}
      {...props}
    />
  );
};
