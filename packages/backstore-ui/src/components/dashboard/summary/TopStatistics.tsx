import React from 'react';
import { Statistic, Row, Col } from '@sradevski/blocks-ui';
import { useTranslation } from 'react-i18next';
import { StatisticsCard } from './StatisticsCard';
import { sdk } from '@sradevski/la-sdk';

export const TopStatistics = () => {
  const { t } = useTranslation();

  return (
    <Row gutter={16} px={[3, 3, 4]} py={2}>
      <Col mt={2} xs={24} lg={8}>
        <StatisticsCard type={sdk.storeAnalytics.AnalyticsTypes.TOTAL_REVENUE}>
          {val => (
            <Statistic
              title={t('analytics.lifetimeRevenue')}
              suffix={'ден'}
              value={val}
            />
          )}
        </StatisticsCard>
      </Col>
      <Col mt={2} xs={24} lg={8}>
        <StatisticsCard
          type={sdk.storeAnalytics.AnalyticsTypes.TOTAL_PRODUCT_COUNT}
        >
          {val => <Statistic title={t('analytics.productCount')} value={val} />}
        </StatisticsCard>
      </Col>
      <Col mt={2} xs={24} lg={8}>
        <StatisticsCard
          type={sdk.storeAnalytics.AnalyticsTypes.TOTAL_ORDER_COUNT}
        >
          {val => (
            <Statistic title={t('analytics.lifetimeOrderCount')} value={val} />
          )}
        </StatisticsCard>
      </Col>
    </Row>
  );
};
