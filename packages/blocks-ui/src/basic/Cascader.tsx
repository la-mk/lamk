import { Cascader as AntCascader } from 'antd';
import { CascaderProps } from 'antd/es/cascader';
import 'antd/es/cascader/style/index.less';

import { system } from '../system';

export const Cascader = system<CascaderProps>(AntCascader);
