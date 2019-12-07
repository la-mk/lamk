import { Radio as AntRadio } from 'antd';
import { RadioProps, RadioGroupProps } from 'antd/es/radio';
import 'antd/es/radio/style/index.less';

import { system } from '../system';

export const Radio = system<RadioProps>(AntRadio as any);
export const RadioButton = system<RadioProps>(AntRadio.Button as any);
export const RadioGroup = system<RadioGroupProps>(AntRadio.Group as any);
