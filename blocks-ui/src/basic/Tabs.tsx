import { default as AntTabs, TabsProps, TabPaneProps } from 'antd/es/tabs';
import 'antd/es/tabs/style/index.less';

import { system } from '../system';

export const Tabs = system<TabsProps>(AntTabs);
export const TabPane = system<TabPaneProps>(AntTabs.TabPane);
