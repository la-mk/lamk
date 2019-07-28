import React, { useEffect } from 'react';
import { Statistic } from '../../../component-lib/basic/Statistic';
import { Card } from '../../../component-lib/basic/Card';
import { Row, Col } from '../../../component-lib/basic/Grid';

export const Summary = () => {
  useEffect(() => {}, []);

  return (
    <Row type='flex' gutter={16} px={[3, 3, 3, 4]} py={2}>
      <Col mt={2} xs={24} lg={8}>
        <Card>
          <Statistic title='Revenue' prefix={'ден'} value={112893} />
        </Card>
      </Col>
      <Col mt={2} xs={24} lg={8}>
        <Card>
          <Statistic title='Orders to fulfill' value={112893} />
        </Card>
      </Col>
      <Col mt={2} xs={24} lg={8}>
        <Card>
          <Statistic title='Monthly Orders' value={112893} />
        </Card>
      </Col>
    </Row>
  );
};
