import React, { useEffect } from 'react';
import { Statistic } from '../../../blocks-ui/basic/Statistic';
import { Card } from '../../../blocks-ui/basic/Card';
import { Row, Col } from '../../../blocks-ui/basic/Grid';

export const Summary = () => {
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
