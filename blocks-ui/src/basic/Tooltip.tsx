import { Tooltip as AntTooltip } from 'antd';
import { TooltipProps } from 'antd/es/tooltip';
import 'antd/es/tooltip/style/index.less';

import { system } from '../system';

export const Tooltip = system<TooltipProps>(AntTooltip);
