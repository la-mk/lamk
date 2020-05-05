import React from 'react';
import { StatisticsCard } from './StatisticsCard';
import { sdk } from '@sradevski/la-sdk';
import { useTranslation } from 'react-i18next';
import { statusLines } from './charts/statusLines';
import { TimeLineChart } from './charts/TimeLineChart';

export const Orders = () => {
  const { t } = useTranslation();

  return (
    <StatisticsCard
      title={t('analytics.orderCount')}
      type={sdk.storeAnalytics.AnalyticsTypes.ORDER_COUNT}
      frequencies={[sdk.storeAnalytics.AnalyticsFrequency.DAILY]}
      defaultFrequency={sdk.storeAnalytics.AnalyticsFrequency.DAILY}
    >
      {data => <TimeLineChart data={data} lines={statusLines} />}
    </StatisticsCard>
  );
};
