import * as React from 'react';
import { Flex } from '../../component-lib/basic/Flex';
import { Button } from '../../component-lib/basic/Button';
import styled from 'styled-components';

const ShopIframe = styled.iframe`
  border: 2px solid lightgray;
  padding: 10px;
`;

export const Publish = () => {
  return (
    <Flex flexDirection='column' alignItems='center'>
      <ShopIframe
        src='https://pelister.tech'
        name='shop-preview'
        width='100%'
        height='500'
        // Can hide a spinner after the iframe is loaded
        onLoad={() => null}
      />

      <Button size='large' type='primary' mt={3}>
        Publish now
      </Button>
      <Button mt={3}>Go to Dashboard</Button>
    </Flex>
  );
};
