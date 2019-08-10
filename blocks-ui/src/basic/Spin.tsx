import { Spin as AntSpin } from 'antd';
import { SpinProps } from 'antd/lib/spin';
import 'antd/lib/spin/style/index.less';

import { system } from '../system';

export const Spin = system<SpinProps>(AntSpin);
