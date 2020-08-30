import React from 'react';
import { TopStatistics } from './TopStatistics';
import { Revenue } from './Revenue';
import { Orders } from './Orders';
import { Row, Col } from '@sradevski/blocks-ui';
import { Visits } from './Visits';
import { StoreLink } from './StoreLink';

export const Summary = () => {
  return (
    <>
      <Row gutter={16} px={[3, 3, 4]} py={2}>
        <Col mt={2} xs={24} xl={24}>
          <StoreLink />
        </Col>
      </Row>

      <Row gutter={16} px={[3, 3, 4]} py={2}>
        <TopStatistics />
      </Row>
      <Row gutter={16} px={[3, 3, 4]} py={2}>
        <Col mt={2} xs={24} xl={12}>
          <Revenue />
        </Col>
        <Col mt={2} xs={24} xl={12}>
          <Orders />
        </Col>
      </Row>
      <Row gutter={16} px={[3, 3, 4]} py={2}>
        <Col mt={2} xs={24} xl={24}>
          <Visits />
        </Col>
      </Row>
    </>
  );
};
