import { Drawer as AntDrawer } from 'antd';
import { DrawerProps as AntDrawerProps } from 'antd/es/drawer';
import 'antd/es/drawer/style/index.less';

export const Drawer = AntDrawer as any;
export type DrawerProps = AntDrawerProps;
