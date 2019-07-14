import { default as AntTooltip, TooltipProps } from 'antd/es/tooltip';
import 'antd/lib/tooltip/style/index.less';

import { system } from '../system';

export const Tooltip = system<TooltipProps>(AntTooltip);
