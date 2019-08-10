import { Tag as AntTag } from 'antd';
import { TagProps, CheckableTagProps } from 'antd/lib/tag';

import 'antd/lib/tag/style/index.less';

import { system } from '../system';

export const Tag = system<TagProps>(AntTag);
export const CheckableTag = system<CheckableTagProps>(
  AntTag.CheckableTag as any,
);
