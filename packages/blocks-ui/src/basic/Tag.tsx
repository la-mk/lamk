import { Tag as AntTag } from 'antd';
import { TagProps, CheckableTagProps } from 'antd/es/tag';

import 'antd/es/tag/style/index.less';

import { system } from '../system';
import styled from 'styled-components';

export const Tag = styled(system<TagProps>(AntTag))`
  text-align: center;
`;

export const CheckableTag = styled(system<CheckableTagProps>(
  AntTag.CheckableTag as any))`
    text-align: center;
  `;
