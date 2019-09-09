import { InputNumber as AntInputNumber } from 'antd';
import { InputNumberProps } from 'antd/es/input-number';
import 'antd/es/input-number/style/index.less';

import { system } from '../system';

export const InputNumber = system<InputNumberProps>(AntInputNumber);
