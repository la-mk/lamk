import { default as AntSelect, SelectProps, OptionProps } from 'antd/es/select';
import 'antd/lib/select/style/index.less';

import { system } from '../system';
import { OptGroupProps } from 'antd/lib/select';

export const Select = system<SelectProps>(AntSelect);
export const Option = system<OptionProps>(AntSelect.Option);
export const OptionGroup = system<OptGroupProps>(AntSelect.OptGroup);
