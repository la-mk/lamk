import React from 'react';
import { Stat, Grid } from '@la-mk/blocks-ui';
import { useTranslation } from 'react-i18next';
import { StatisticsCard } from './StatisticsCard';
import { sdk } from '@la-mk/la-sdk';

export const TopStatistics = () => {
  const { t } = useTranslation();

  return (
    <>
      <Grid mt={3} spacing={5} minChildWidth='280px'>
        <StatisticsCard type={sdk.storeAnalytics.AnalyticsTypes.TOTAL_REVENUE}>
          {(val: number) => (
            <Stat
              title={t('analytics.lifetimeRevenue')}
              value={`${(val ?? 0)?.toLocaleString()} ден`}
            />
          )}
        </StatisticsCard>
        <StatisticsCard
          type={sdk.storeAnalytics.AnalyticsTypes.TOTAL_PRODUCT_COUNT}
        >
          {val => <Stat title={t('analytics.productCount')} value={val ?? 0} />}
        </StatisticsCard>
        <StatisticsCard
          type={sdk.storeAnalytics.AnalyticsTypes.TOTAL_ORDER_COUNT}
        >
          {val => (
            <Stat title={t('analytics.lifetimeOrderCount')} value={val ?? 0} />
          )}
        </StatisticsCard>
      </Grid>
    </>
  );
};
