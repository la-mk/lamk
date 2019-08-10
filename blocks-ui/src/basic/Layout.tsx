import { Layout as AntLayout } from 'antd';
import { LayoutProps, SiderProps } from 'antd/lib/layout';
import 'antd/lib/layout/style/index.less';

import { system } from '../system';

export const Layout = system<LayoutProps>(AntLayout);
export const Header = system<LayoutProps>(AntLayout.Header);
export const Footer = system<LayoutProps>(AntLayout.Footer);
export const Sider = system<SiderProps>(AntLayout.Sider);
export const Content = system<LayoutProps>(AntLayout.Content);
