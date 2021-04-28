import React from 'react';
import { Stat, Grid } from '@la-mk/blocks-ui';
import { useTranslation } from 'react-i18next';
import { StatisticsCard } from './StatisticsCard';
import { sdk } from '@la-mk/la-sdk';
import { useSelector } from 'react-redux';
import { getStore } from '../../../state/modules/store/store.selector';

export const TopStatistics = () => {
  const store = useSelector(getStore);
  const { t } = useTranslation();

  return (
    <>
      <Grid mt={3} spacing={5} minChildWidth='280px'>
        <StatisticsCard type={sdk.storeAnalytics.AnalyticsTypes.TOTAL_REVENUE}>
          {(val: number) => (
            <Stat
              title={t('analytics.lifetimeRevenue')}
              // TODO: this value here would be incorrect if the currency changed, convert based on order currency.
              value={`${(val ?? 0)?.toLocaleString()} ${t(
                `currencies.${store.preferences.currency ?? 'mkd'}`,
              )}`}
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
