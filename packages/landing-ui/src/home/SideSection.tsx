import React from 'react';
import { Flex, Image, Box, Title, Text } from '@sradevski/blocks-ui';
import styled from 'styled-components';

const LeftBar = styled(Flex)`
  background: #f2f3f6;
  border-top-right-radius: 12px;
  border-bottom-right-radius: 12px;
  margin-right: auto;
`;

const RightBar = styled(Flex)`
  background: #f2f3f6;
  border-top-left-radius: 12px;
  border-bottom-left-radius: 12px;
  margin-left: auto;
`;

const ImageCard = styled(Box)`
  border-radius: 8px;
  box-shadow: 6px 6px 30px 6px lightgray;
`;

const BarImage = () => {
  return (
    <ImageCard
      mx={['auto', 3, 4]}
      mt={4}
      mb={[4, -3, -4]}
      width={[300, '35vw', '30vw']}
      height={'100%'}
    >
      <Image src='/products.png' />
    </ImageCard>
  );
};

const Description = ({ side }) => {
  const outerMargin = [4, 5, 5];
  const innerMargin = [4, 'auto', 'auto'];
  return (
    <Flex
      flexDirection='column'
      alignItems={['center', 'flex-start', 'flex-start']}
      justifyContent='center'
      p={4}
      ml={side === 'left' ? innerMargin : outerMargin}
      mr={side === 'left' ? outerMargin : innerMargin}
    >
      <Title level={2}>Modern online store</Title>
      <Text>Something something</Text>
      <Text>Something something</Text>
      <Text>Something something</Text>
      <Text>Something something</Text>
      <Text>Something something</Text>
    </Flex>
  );
};

export const SideSection = ({ side, ...props }) => {
  const Bar = side === 'left' ? LeftBar : RightBar;
  const children = [<BarImage />, <Description side={side} />];

  return (
    <Bar
      width={['100%', '90%', '80%', '80%']}
      {...props}
      flexDirection={[
        side === 'left' ? 'column-reverse' : 'column',
        'row',
        'row',
      ]}
    >
      {(side === 'left' ? children : children.reverse()).map((x) => x)}
    </Bar>
  );
};
