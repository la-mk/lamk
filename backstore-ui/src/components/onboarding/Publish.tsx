import * as React from 'react';
import { Flex, Button } from 'blocks-ui';
import styled from 'styled-components';

const ShopIframe = styled.iframe`
  border: 0;
  padding: 0;
  margin: 0;
  height: 100vh;
  width: 100vw;
`;

interface PublishProps {
  onDone: (shouldPublish: boolean) => void;
}

export const Publish = ({ onDone }: PublishProps) => {
  return (
    <Flex flexDirection='column' alignItems='center'>
      <Flex
        flexDirection='row'
        width='100%'
        style={{ backgroundColor: 'lightgray' }}
        justifyContent='center'
        alignItems='center'
      >
        <Button onClick={() => onDone(true)} size='large' type='primary' m={3}>
          Publish now
        </Button>
        <Button onClick={() => onDone(false)} size='large' m={3}>
          Go to Dashboard
        </Button>
      </Flex>
      <ShopIframe
        src='http://localhost:4000'
        name='shop-preview'
        // Can hide a spinner after the iframe is loaded
        onLoad={() => null}
      />
    </Flex>
  );
};
