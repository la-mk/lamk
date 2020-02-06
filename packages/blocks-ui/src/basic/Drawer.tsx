import { Drawer as AntDrawer } from 'antd';
import { DrawerProps } from 'antd/es/drawer';
import 'antd/es/drawer/style/index.less';

import { system } from '../system';

export const Drawer = system<DrawerProps>(AntDrawer as any);
