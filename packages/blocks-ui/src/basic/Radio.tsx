import { Radio as AntRadio } from 'antd';
import { RadioProps, RadioGroupProps } from 'antd/es/radio';
import 'antd/es/radio/style/index.less';

import { system } from '../system';

export const Radio = system<RadioProps>(AntRadio);
export const RadioButton = system<RadioProps>(AntRadio.Button);
export const RadioGroup = system<RadioGroupProps>(AntRadio.Group);
