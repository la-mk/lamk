import { Collapse as AntCollapse } from 'antd';
import { CollapseProps, CollapsePanelProps } from 'antd/es/collapse';
import 'antd/es/collapse/style/index.less';

import { system } from '../system';

export const Collapse = system<CollapseProps>(AntCollapse);
export const CollapsePanel = system<CollapsePanelProps>(AntCollapse.Panel);
