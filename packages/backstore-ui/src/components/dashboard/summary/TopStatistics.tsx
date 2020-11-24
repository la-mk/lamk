import React from 'react';
import { Statistic, Grid } from '@sradevski/blocks-ui';
import { useTranslation } from 'react-i18next';
import { StatisticsCard } from './StatisticsCard';
import { sdk } from '@sradevski/la-sdk';

export const TopStatistics = () => {
  const { t } = useTranslation();

  return (
    <>
      <Grid mt={3} spacing={5} minChildWidth='280px'>
        <StatisticsCard type={sdk.storeAnalytics.AnalyticsTypes.TOTAL_REVENUE}>
          {val => (
            <Statistic
              title={t('analytics.lifetimeRevenue')}
              suffix={'ден'}
              value={val}
            />
          )}
        </StatisticsCard>
        <StatisticsCard
          type={sdk.storeAnalytics.AnalyticsTypes.TOTAL_PRODUCT_COUNT}
        >
          {val => <Statistic title={t('analytics.productCount')} value={val} />}
        </StatisticsCard>
        <StatisticsCard
          type={sdk.storeAnalytics.AnalyticsTypes.TOTAL_ORDER_COUNT}
        >
          {val => (
            <Statistic title={t('analytics.lifetimeOrderCount')} value={val} />
          )}
        </StatisticsCard>
      </Grid>
    </>
  );
};
