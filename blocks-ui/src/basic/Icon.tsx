import { default as AntIcon, IconProps } from 'antd/es/icon';
import 'antd/es/icon/style/index.less';

import { system } from '../system';

export const Icon = system<IconProps>(AntIcon as any);
