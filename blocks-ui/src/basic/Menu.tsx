import { Menu as AntMenu } from 'antd';
import { MenuProps } from 'antd/lib/menu';
import { MenuItemProps } from 'antd/lib/menu/MenuItem';
import { SubMenuProps } from 'antd/lib/menu/SubMenu';
import 'antd/lib/menu/style/index.less';

import { system } from '../system';

export const Menu = system<MenuProps>(AntMenu);
export const SubMenu = system<SubMenuProps>(AntMenu.SubMenu as any);
export const MenuItem = system<MenuItemProps>(AntMenu.Item as any);
export const MenuItemGroup = system<any>(AntMenu.ItemGroup as any);
export const MenuDivider = system<any>(AntMenu.Divider as any);
