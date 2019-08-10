import { Tooltip as AntTooltip } from 'antd';
import { TooltipProps } from 'antd/lib/tooltip';
import 'antd/lib/tooltip/style/index.less';

import { system } from '../system';

export const Tooltip = system<TooltipProps>(AntTooltip);
