import { Statistic as AntStatistic } from 'antd';
import { StatisticProps } from 'antd/lib/statistic/Statistic';
import 'antd/lib/statistic/style/index.less';

import { system } from '../system';

export const Statistic = system<StatisticProps>(AntStatistic as any);
