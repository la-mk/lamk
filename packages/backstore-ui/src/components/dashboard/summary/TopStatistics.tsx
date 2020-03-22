import React from 'react';
import { Statistic, Row, Col } from '@sradevski/blocks-ui';
import { useTranslation } from 'react-i18next';
import { StatisticsCard } from './StatisticsCard';
import { sdk } from '@sradevski/la-sdk';

export const TopStatistics = () => {
  const { t } = useTranslation();

  return (
    <Row type='flex' gutter={16} px={[3, 3, 4]} py={2}>
      <Col mt={2} xs={24} lg={8}>
        <StatisticsCard type={sdk.storeAnalytics.AnalyticsTypes.REVENUE}>
          {val => {
            const total =
              (val?.[sdk.order.OrderStatus.COMPLETED] ?? 0) +
              (val?.[sdk.order.OrderStatus.SHIPPED] ?? 0) +
              (val?.[sdk.order.OrderStatus.PENDING_SHIPMENT] ?? 0);

            return (
              <Statistic
                title={t('commerce.revenue')}
                suffix={'ден'}
                value={total}
              />
            );
          }}
        </StatisticsCard>
      </Col>
      <Col mt={2} xs={24} lg={8}>
        <StatisticsCard type={sdk.storeAnalytics.AnalyticsTypes.PRODUCTS_COUNT}>
          {val => (
            <Statistic title={t('commerce.product_plural')} value={val} />
          )}
        </StatisticsCard>
      </Col>
      <Col mt={2} xs={24} lg={8}>
        <StatisticsCard type={sdk.storeAnalytics.AnalyticsTypes.ORDERS_COUNT}>
          {val => <Statistic title={t('commerce.order_plural')} value={val} />}
        </StatisticsCard>
      </Col>
    </Row>
  );
};
