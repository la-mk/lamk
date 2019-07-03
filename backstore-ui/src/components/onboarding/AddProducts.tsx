import * as React from 'react';
import { Col, Row } from '../../component-lib/basic/Grid';
import { Button } from '../../component-lib/basic/Button';
import { CreateProductCard } from './CreateProductCard';
import { Flex } from '../../component-lib/basic/Flex';

export const AddProducts = ({ onDone }: any) => {
  return (
    <Row type='flex' align='middle' gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
      <Col>
        <CreateProductCard />
      </Col>
      <Col>
        <Flex
          flexDirection='column'
          alignItems='center'
          justifyContent='center'
          width={390}
          my={4}
        >
          <Button size='large' width='60%' icon={'plus'} type='primary'>
            Add Another Product
          </Button>
          <Button type='default' size='large' width='60%' mt={3}>
            Next
          </Button>
        </Flex>
      </Col>
    </Row>
  );
};
