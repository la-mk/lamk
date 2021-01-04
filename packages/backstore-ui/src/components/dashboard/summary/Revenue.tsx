import React from 'react';
import { StatisticsCard } from './StatisticsCard';
import { sdk } from '@la-mk/la-sdk';
import { useTranslation } from 'react-i18next';
import { TimeLineChart } from './charts/TimeLineChart';
import { Line } from 'recharts';

export const Revenue = () => {
  const { t } = useTranslation();
  return (
    <StatisticsCard
      title={t('analytics.revenue')}
      type={sdk.storeAnalytics.AnalyticsTypes.REVENUE}
      frequencies={[sdk.storeAnalytics.AnalyticsFrequency.DAILY]}
      defaultFrequency={sdk.storeAnalytics.AnalyticsFrequency.DAILY}
    >
      {data => (
        <TimeLineChart
          data={data}
          lines={() => [
            <Line
              key='revenue'
              isAnimationActive={false}
              name={t('analytics.revenue') as string}
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
