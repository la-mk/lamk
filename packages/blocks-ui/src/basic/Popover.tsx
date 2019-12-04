import { Popover as AntPopover } from 'antd';
import { PopoverProps } from 'antd/es/popover';
import 'antd/es/popover/style/index.less';

import { system } from '../system';

export const Popover = system<PopoverProps>(AntPopover);
