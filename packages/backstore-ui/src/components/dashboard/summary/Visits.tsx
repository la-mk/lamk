import React from 'react';
import { StatisticsCard } from './StatisticsCard';
import { sdk } from '@sradevski/la-sdk';
import { useTranslation } from 'react-i18next';
import { TimeLineChart } from './charts/TimeLineChart';
import { Line } from 'recharts';

export const Visits = () => {
  const { t } = useTranslation();
  return (
    <StatisticsCard
      title={t('analytics.visitCount')}
      type={sdk.storeAnalytics.AnalyticsTypes.VISIT_COUNT}
      frequencies={[sdk.storeAnalytics.AnalyticsFrequency.DAILY]}
      defaultFrequency={sdk.storeAnalytics.AnalyticsFrequency.DAILY}
    >
      {data => (
        <TimeLineChart
          data={data}
          lines={() => [
            <Line
              key='visitCount'
              isAnimationActive={false}
              name={t('analytics.visitCount') as string}
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
