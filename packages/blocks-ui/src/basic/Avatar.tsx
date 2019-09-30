import { Avatar as AntAvatar } from 'antd';
import { AvatarProps } from 'antd/es/avatar';
import 'antd/es/avatar/style/index.less';

import { system } from '../system';

export const Avatar = system<AvatarProps>(AntAvatar);
