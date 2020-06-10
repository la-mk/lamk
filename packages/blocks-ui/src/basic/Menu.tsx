import { Menu as AntMenu } from 'antd';
import { MenuProps } from 'antd/es/menu';
import { MenuItemProps } from 'antd/es/menu/MenuItem';
import { SubMenuProps } from 'antd/es/menu/SubMenu';
import 'antd/es/menu/style/index.less';

import { system } from '../system';

export const Menu = system<MenuProps>(AntMenu);
export const SubMenu = system<SubMenuProps>(AntMenu.SubMenu);
export const MenuItem = system<MenuItemProps>(AntMenu.Item);
export const MenuItemGroup = system<any>(AntMenu.ItemGroup);
export const MenuDivider = system<any>(AntMenu.Divider);
