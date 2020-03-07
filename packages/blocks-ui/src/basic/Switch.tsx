import { Switch as AntSwitch } from 'antd';
import { SwitchProps } from 'antd/es/switch';
import 'antd/es/switch/style/index.less';

import { system } from '../system';

export const Switch = system<SwitchProps>(AntSwitch);
