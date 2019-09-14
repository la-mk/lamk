import { Badge as AntBadge } from 'antd';
import { BadgeProps } from 'antd/es/badge';
import 'antd/es/badge/style/index.less';

import { system } from '../system';

export const Badge = system<BadgeProps>(AntBadge);
