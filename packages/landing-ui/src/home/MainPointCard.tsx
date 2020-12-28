import React from 'react';
import { Flex, Image, Heading, Text, Box } from '@sradevski/blocks-ui';

const BarImage = ({ src, alt, overflow }) => {
  const margins = {
    mt: overflow === 'top' ? [4, 4, '-7%'] : 4,
    mb: overflow === 'bottom' ? [4, 4, '-7%'] : 4,
    my: overflow === 'both' ? [4, 4, '-7%'] : undefined,
    mx: ['auto', 3, 4],
  };

  return (
    <Box
      maxWidth={[300, 350, 500]}
      width={[300, '50%', '40%']}
      height={'100%'}
      {...margins}
    >
      <Box width='100%' height='100%'>
        <Image src={src} alt={alt} />
      </Box>
    </Box>
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
      direction='column'
      align={['center', 'flex-start', 'flex-start']}
      justify='center'
      maxWidth={['100%', 400, 500]}
      p={[1, 3, 4]}
      my={[4, 0, 0]}
      ml={side === 'left' ? innerMargin : outerMargin}
      mr={side === 'left' ? outerMargin : innerMargin}
    >
      <Heading align={['center', 'start', 'start']} as={'h3'}>
        {title}
      </Heading>
      <Text align={['center', 'start', 'start']}>{description}</Text>
    </Flex>
  );
};

export type MainPointCardProps = {
  side: 'left' | 'right';
  overflow: 'top' | 'bottom' | 'both';
  image: string;
  title: string;
  description: string;
} & React.ComponentProps<typeof Box>;

export const MainPointCard = ({
  side,
  overflow,
  image,
  title,
  description,
  ...props
}: MainPointCardProps) => {
  const children = [
    <BarImage alt={title} key='image' src={image} overflow={overflow} />,
    <Description
      key='description'
      side={side}
      title={title}
      description={description}
    />,
  ];

  return (
    <Box
      p={[3, 4, 4]}
      mx='auto'
      width={['100%', '94%', '90%']}
      maxWidth={1280}
      bg='background.light'
      // @ts-ignore
      borderRadius={'xs'}
      {...props}
    >
      <Flex
        direction={[
          side === 'left' ? 'column-reverse' : 'column',
          'row',
          'row',
        ]}
      >
        {(side === 'left' ? children : children.reverse()).map(x => x)}
      </Flex>
    </Box>
  );
};
