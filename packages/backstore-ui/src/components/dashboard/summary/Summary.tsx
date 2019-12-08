import React from 'react';
import { Statistic, Card, Row, Col } from '@sradevski/blocks-ui';
import { useTranslation } from 'react-i18next';

export const Summary = () => {
  const { t } = useTranslation();

  return (
    <Row type='flex' gutter={16} px={[3, 3, 3, 4]} py={2}>
      <Col mt={2} xs={24} lg={8}>
        <Card>
          <Statistic
            title={t('commerce.revenue')}
            prefix={'ден'}
            value={112893}
          />
        </Card>
      </Col>
    </Row>
  );
};
