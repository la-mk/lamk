import { Tag as AntTag } from 'antd';
import {
  TagProps as TagPropsBase,
  CheckableTagProps as CheckableTagPropsBase,
} from 'antd/es/tag';

import 'antd/es/tag/style/index.less';

import { system } from '../system';
import styled from 'styled-components';

export interface TagProps extends TagPropsBase {
  compact?: boolean;
}

export interface CheckableTagProps extends CheckableTagPropsBase {
  compact?: boolean;
}

export const Tag = styled(system<TagProps>(AntTag))`
  text-align: center;
  pointer-events: ${props => (props.closable ? 'initial' : 'none')};
  line-height: ${props =>
    props.compact
      ? props.theme.fontSizes[1] * props.theme.lineHeight
      : props.theme.fontSizes[3] * props.theme.lineHeight}px;
  font-size: ${props => props.theme.fontSizes[props.compact ? 0 : 1]}px;
  border-radius: ${props => props.theme.radii[0]}px;
`;

export const CheckableTag = styled(
  system<CheckableTagProps>(AntTag.CheckableTag as any)
)`
  text-align: center;
  line-height: ${props =>
    props.compact
      ? props.theme.fontSizes[1] * props.theme.lineHeight
      : props.theme.fontSizes[3] * props.theme.lineHeight}px;
  font-size: ${props => props.theme.fontSizes[props.compact ? 0 : 1]}px;
  border-radius: ${props => props.theme.radii[0]}px;
`;
