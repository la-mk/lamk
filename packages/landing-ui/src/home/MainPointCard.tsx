import React from 'react';
import { Flex, Image, Title, Text, Card } from '@sradevski/blocks-ui';
import { CardProps } from 'antd/lib/card';
import { SystemProps } from '@sradevski/blocks-ui/dist/system';

const BarImage = ({ src, overflow }) => {
  const margins = {
    mt: overflow === 'top' ? [4, 4, '-7%'] : 4,
    mb: overflow === 'bottom' ? [4, 4, '-7%'] : 4,
    my: overflow === 'both' ? [4, 4, '-7%'] : undefined,
    mx: ['auto', 3, 4],
  };

  return (
    <Image src={src} width={[320, 350, 500]} height={'100%'} {...margins} />
  );
};

const Description = ({
  side,
  title,
  description,
}: {
  side: 'left' | 'right';
  title: string;
  description: string;
}) => {
  const outerMargin = [3, 4, 5];
  const innerMargin = [2, 'auto', 'auto'];
  return (
    <Flex
      flexDirection='column'
      alignItems={['center', 'flex-start', 'flex-start']}
      justifyContent='center'
      maxWidth={['100%', 400, 500]}
      p={[1, 3, 4]}
      mb={[3, 0, 0]}
      ml={side === 'left' ? innerMargin : outerMargin}
      mr={side === 'left' ? outerMargin : innerMargin}
    >
      <Title textAlign={['center', 'start', 'start']} level={3}>
        {title}
      </Title>
      <Text textAlign={['center', 'start', 'start']}>{description}</Text>
    </Flex>
  );
};

export interface MainPointCardProps extends CardProps, SystemProps {
  side: 'left' | 'right';
  overflow: 'top' | 'bottom' | 'both';
  image: string;
  title: string;
  description: string;
}

export const MainPointCard = ({
  side,
  overflow,
  image,
  title,
  description,
  ...props
}: any) => {
  const children = [
    <BarImage key='image' src={image} overflow={overflow} />,
    <Description
      key='description'
      side={side}
      title={title}
      description={description}
    />,
  ];

  return (
    <Card
      mx='auto'
      width={['100%', '90%', '80%', '80%']}
      maxWidth={1280}
      bg='background.light'
      {...props}
    >
      <Flex
        flexDirection={[
          side === 'left' ? 'column-reverse' : 'column',
          'row',
          'row',
        ]}
      >
        {(side === 'left' ? children : children.reverse()).map((x) => x)}
      </Flex>
    </Card>
  );
};
