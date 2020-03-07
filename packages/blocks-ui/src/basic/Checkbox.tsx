import { Checkbox as AntCheckbox } from 'antd';
import { CheckboxProps, CheckboxGroupProps } from 'antd/es/checkbox';
import 'antd/es/checkbox/style/index.less';

import { system } from '../system';

export const Checkbox = system<CheckboxProps>(AntCheckbox);
export const CheckboxGroup = system<CheckboxGroupProps>(AntCheckbox.Group);
