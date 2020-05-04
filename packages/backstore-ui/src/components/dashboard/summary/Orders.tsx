import React from 'react';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { StatisticsCard } from './StatisticsCard';
import { sdk } from '@sradevski/la-sdk';
import { useTranslation } from 'react-i18next';

export const Orders = () => {
  const { t } = useTranslation();

  return (
    <StatisticsCard
      title={'Order count'}
      type={sdk.storeAnalytics.AnalyticsTypes.ORDER_COUNT}
      frequency={sdk.storeAnalytics.AnalyticsFrequency.DAILY}
    >
      {(res: any[]) => {
        let domain: any = [Date.now(), Date.now()];

        if (res && res.length >= 1) {
          const minTimestamp = new Date(res[0].timestamp).getTime();
          const maxTimestamp = new Date(res[res.length - 1]).getTime();
          domain = [minTimestamp, maxTimestamp];
        }

        return (
          <ResponsiveContainer height={400} width='100%'>
            <LineChart
              data={res}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis
                type='number'
                domain={domain}
                tickFormatter={entry => new Date(entry).toDateString()}
                dataKey={entry => new Date(entry.timestamp).getTime()}
              />
              <YAxis />
              <Tooltip />
              <Legend />

              <Line
                isAnimationActive={false}
                name={t('orderStatus.cancelled')}
                type='monotone'
                dataKey={entry => entry.value.cancelled ?? 0}
                stroke='#8884d8'
              />
              <Line
                isAnimationActive={false}
                name={t('orderStatus.pendingPayment')}
                type='monotone'
                dataKey={entry => entry.value.pendingPayment ?? 0}
                stroke='#8234d8'
              />
              <Line
                isAnimationActive={false}
                name={t('orderStatus.pendingShipment')}
                type='monotone'
                dataKey={entry => entry.value.pendingShipment ?? 0}
                stroke='#fb34d8'
              />
              <Line
                isAnimationActive={false}
                name={t('orderStatus.shipped')}
                type='monotone'
                dataKey={entry => entry.value.shipped ?? 0}
                stroke='#82ca9d'
              />
              <Line
                isAnimationActive={false}
                name={t('orderStatus.completed')}
                type='monotone'
                dataKey={entry => entry.value.completed ?? 0}
                stroke='#87321d'
              />
            </LineChart>
          </ResponsiveContainer>
        );
      }}
    </StatisticsCard>
  );
};
