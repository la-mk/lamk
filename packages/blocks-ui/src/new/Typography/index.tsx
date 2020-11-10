import {
  DisplayLarge as BaseDisplayLarge,
  DisplayMedium as BaseDisplayMedium,
  DisplaySmall as BaseDisplaySmall,
  DisplayXSmall as BaseDisplayXSmall,
  ParagraphLarge as BaseParagraphLarge,
  ParagraphMedium as BaseParagraphMedium,
  ParagraphSmall as BaseParagraphSmall,
  ParagraphXSmall as BaseParagraphXSmall,
  LabelLarge as BaseLabelLarge,
  LabelMedium as BaseLabelMedium,
  LabelSmall as BaseLabelSmall,
  LabelXSmall as BaseLabelXSmall,
  // We rename these for consistency and we don't really want to use h5 and h6 normally.
  HeadingXXLarge as BaseHeadingLarge,
  HeadingXLarge as BaseHeadingMedium,
  HeadingLarge as BaseHeadingSmall,
  HeadingMedium as BaseHeadingXSmall,
} from 'baseui/typography';

import { BlockProps } from 'baseui/block';
import { system, SystemProps } from '../system';
import { useBreakpoint } from '../../hooks/useBreakpoint';

export type TypographySize = 'large' | 'medium' | 'small' | 'xsmall';

export const Display = ({
  size,
  ...props
}: BlockProps & { size: TypographySize | TypographySize[] } & SystemProps) => {
  const selectedSize = useBreakpoint(
    Array.isArray(size) ? size : [size, size, size]
  );

  switch (selectedSize) {
    case 'large':
      return system(BaseDisplayLarge, ['textAlign'])(props);
    case 'medium':
      return system(BaseDisplayMedium, ['textAlign'])(props);
    case 'small':
      return system(BaseDisplaySmall, ['textAlign'])(props);
    case 'xsmall':
    default:
      return system(BaseDisplayXSmall, ['textAlign'])(props);
  }
};

export const Paragraph = ({
  size,
  ...props
}: BlockProps & { size: TypographySize | TypographySize[] } & SystemProps) => {
  const selectedSize = useBreakpoint(
    Array.isArray(size) ? size : [size, size, size]
  );

  switch (selectedSize) {
    case 'large':
      return system(BaseParagraphLarge, ['textAlign'])(props);
    case 'medium':
      return system(BaseParagraphMedium, ['textAlign'])(props);
    case 'small':
      return system(BaseParagraphSmall, ['textAlign'])(props);
    case 'xsmall':
    default:
      return system(BaseParagraphXSmall, ['textAlign'])(props);
  }
};

export const Label = ({
  size,
  ...props
}: BlockProps & { size: TypographySize | TypographySize[] } & SystemProps) => {
  const selectedSize = useBreakpoint(
    Array.isArray(size) ? size : [size, size, size]
  );

  switch (selectedSize) {
    case 'large':
      return system(BaseLabelLarge, ['textAlign'])(props);
    case 'medium':
      return system(BaseLabelMedium, ['textAlign'])(props);
    case 'small':
      return system(BaseLabelSmall, ['textAlign'])(props);
    case 'xsmall':
    default:
      return system(BaseLabelXSmall, ['textAlign'])(props);
  }
};

export const Heading = ({
  size,
  ...props
}: BlockProps & { size: TypographySize | TypographySize[] } & SystemProps) => {
  const selectedSize = useBreakpoint(
    Array.isArray(size) ? size : [size, size, size]
  );

  switch (selectedSize) {
    case 'large':
      return system(BaseHeadingLarge, ['textAlign'])(props);
    case 'medium':
      return system(BaseHeadingMedium, ['textAlign'])(props);
    case 'small':
      return system(BaseHeadingSmall, ['textAlign'])(props);
    case 'xsmall':
    default:
      return system(BaseHeadingXSmall, ['textAlign'])(props);
  }
};
