import * as React from 'react';
import { Col, Row } from '../../component-lib/basic/Grid';
import { Button } from '../../component-lib/basic/Button';
import { AddProductCard } from './AddProductCard';

export const AddProducts = ({ onDone }: any) => {
  return (
    <Row type='flex' gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
      <Col>
        <AddProductCard />
      </Col>
      <Col>
        <Button icon={'plus'}>Add Product</Button>
      </Col>
    </Row>
  );
};
