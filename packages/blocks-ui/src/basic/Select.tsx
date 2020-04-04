import { Select as AntSelect } from 'antd';
import { SelectProps } from 'antd/es/select';
import {OptionProps} from 'rc-select/es/Option';
import { OptGroupProps } from 'rc-select/es/OptGroup';
import 'antd/es/select/style/index.less';

import { system } from '../system';

// TODO: I am not sure how we can wrap this in system and still be able to pass generics to it. (there are few other similar cases)
export const Select = system<SelectProps<any>>(AntSelect as any);
export const Option = system<OptionProps>(AntSelect.Option as any);
export const OptionGroup = system<OptGroupProps>(AntSelect.OptGroup as any);
