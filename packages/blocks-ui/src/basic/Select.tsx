import { Select as AntSelect } from 'antd';
import { SelectProps, OptionProps } from 'antd/es/select';
import 'antd/es/select/style/index.less';

import { system } from '../system';
import { OptGroupProps } from 'antd/es/select';

export const Select = system<SelectProps>(AntSelect);
export const Option = system<OptionProps>(AntSelect.Option);
export const OptionGroup = system<OptGroupProps>(AntSelect.OptGroup);
