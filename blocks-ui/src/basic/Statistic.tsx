import AntStatistic, { StatisticProps } from 'antd/es/statistic/Statistic';
import 'antd/es/statistic/style/index.less';

import { system } from '../system';

export const Statistic = system<StatisticProps>(AntStatistic as any);
