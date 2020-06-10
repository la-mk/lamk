import { Divider as AntDivider } from 'antd';
import { DividerProps } from 'antd/es/divider';
import 'antd/es/divider/style/index.less';

import { system } from '../system';

export const Divider = system<DividerProps>(AntDivider, ['color']);
