import { Tag as AntTag } from 'antd';
import { TagProps, CheckableTagProps } from 'antd/es/tag';

import 'antd/es/tag/style/index.less';

import { system } from '../system';

export const Tag = system<TagProps>(AntTag, ['color', 'textAlign', 'fontSize']);
export const CheckableTag = system<CheckableTagProps>(
  AntTag.CheckableTag as any,
  ['color', 'textAlign', 'fontSize']
);
