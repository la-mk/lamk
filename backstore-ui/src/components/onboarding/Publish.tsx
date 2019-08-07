import * as React from 'react';
import { Flex } from '../../blocks-ui/basic/Flex';
import { Button } from '../../blocks-ui/basic/Button';
import styled from 'styled-components';

const ShopIframe = styled.iframe`
  border: 2px solid lightgray;
  padding: ${props => props.theme.space[2]}px;
  margin-top: ${props => props.theme.space[1]}px;
`;

interface PublishProps {
  onDone: (shouldPublish: boolean) => void;
}

export const Publish = ({ onDone }: PublishProps) => {
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

      <Button
        onClick={() => onDone(true)}
        size='large'
        width='40%'
        type='primary'
        mt={3}
      >
        Publish now
      </Button>
      <Button onClick={() => onDone(false)} width='40%' mt={3}>
        Go to Dashboard
      </Button>
    </Flex>
  );
};
