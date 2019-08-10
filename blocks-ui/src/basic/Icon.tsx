import { Icon as AntIcon } from 'antd';
import { IconProps } from 'antd/lib/icon';
import 'antd/lib/icon/style/index.less';

import { system } from '../system';

export const Icon = system<IconProps>(AntIcon as any);
