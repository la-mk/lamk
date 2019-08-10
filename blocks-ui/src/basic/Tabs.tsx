import { Tabs as AntTabs } from 'antd';
import { TabsProps, TabPaneProps } from 'antd/lib/tabs';
import 'antd/lib/tabs/style/index.less';

import { system } from '../system';

export const Tabs = system<TabsProps>(AntTabs);
export const TabPane = system<TabPaneProps>(AntTabs.TabPane);
