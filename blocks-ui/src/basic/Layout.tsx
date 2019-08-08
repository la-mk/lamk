import { default as AntLayout, LayoutProps, SiderProps } from 'antd/es/layout';
import 'antd/es/layout/style/index.less';

import { system } from '../system';

export const Layout = system<LayoutProps>(AntLayout);
export const Header = system<LayoutProps>(AntLayout.Header);
export const Footer = system<LayoutProps>(AntLayout.Footer);
export const Sider = system<SiderProps>(AntLayout.Sider);
export const Content = system<LayoutProps>(AntLayout.Content);
