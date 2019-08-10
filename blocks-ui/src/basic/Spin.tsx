import { Spin as AntSpin } from 'antd';
import { SpinProps } from 'antd/es/spin';
import 'antd/es/spin/style/index.less';

import { system } from '../system';

export const Spin = system<SpinProps>(AntSpin);
