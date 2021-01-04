import React from 'react';
import { StatisticsCard } from './StatisticsCard';
import { sdk } from '@la-mk/la-sdk';
import { useTranslation } from 'react-i18next';
import { TimeLineChart } from './charts/TimeLineChart';
import { Line } from 'recharts';

export const Orders = () => {
  const { t } = useTranslation();

  return (
    <StatisticsCard
      title={t('analytics.orderCount')}
      type={sdk.storeAnalytics.AnalyticsTypes.ORDER_COUNT}
      frequencies={[sdk.storeAnalytics.AnalyticsFrequency.DAILY]}
      defaultFrequency={sdk.storeAnalytics.AnalyticsFrequency.DAILY}
    >
      {data => (
        <TimeLineChart
          data={data}
          lines={() => [
            <Line
              key='orderCount'
              isAnimationActive={false}
              name={t('analytics.orderCount') as string}
              type='monotone'
              dataKey={entry => entry.value ?? 0}
              stroke={'#1890ff'}
            />,
          ]}
        />
      )}
    </StatisticsCard>
  );
};
