import { Dropdown as AntDropdown } from 'antd';
import { DropDownProps } from 'antd/es/dropdown';
import 'antd/es/dropdown/style/index.less';

import { system } from '../system';

export const Dropdown = system<DropDownProps>(AntDropdown);
