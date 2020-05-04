import React from 'react';
import { TopStatistics } from './TopStatistics';
import { Revenue } from './Revenue';
import { Orders } from './Orders';
import { Row, Col, Title } from '@sradevski/blocks-ui';

export const Summary = () => {
  return (
    <>
      <TopStatistics />
      <Row gutter={16} px={[3, 3, 4]} py={2}>
        <Col mt={2} xs={24} xl={12}>
          <Revenue />
        </Col>
        <Col mt={2} xs={24} xl={12}>
          <Orders />
        </Col>
      </Row>
    </>
  );
};
