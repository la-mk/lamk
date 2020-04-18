import React from 'react';
import {
  Box,
  Paragraph,
  Title,
  Image,
  Flex,
  Text,
  Button,
} from '@sradevski/blocks-ui';
import { withTheme } from 'styled-components';
import { CurvedSection } from '../common/CurvedSection';

export const Hero = withTheme(({ theme, setShowVideo }) => {
  const heroButtons = [
    <Button
      mr={2}
      type='primary'
      size='large'
      onClick={() => setShowVideo(true)}
    >
      Watch the video
    </Button>,
    <Button ml={2} size='large'>
      See demo shop
    </Button>,
  ];

  return (
    <CurvedSection
      direction='down'
      backgroundColor={theme.colors.lightBackground}
    >
      <Flex
        alignItems='center'
        justifyContent='center'
        flexDirection={['column', 'row', 'row']}
      >
        <Box mr={[0, 3, 3]} maxWidth={600}>
          <Title color='primary' level={1} mb={2} fontSize={[6, 6, 7]}>
            How <Text color='secondary'>It Works</Text>
          </Title>
          <Paragraph>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum
            voluptatibus optio tempora vero, odio velit earum fugiat eveniet
            assumenda ullam ab reprehenderit illo eum dolores omnis dignissimos
            natus, voluptatem maiores.
          </Paragraph>
          <Box display={['none', 'flex', 'flex']} mt={5}>
            <Flex>{heroButtons}</Flex>
          </Box>
        </Box>
        <Image
          mt={[3, 0, 0]}
          ml={[0, 3, 3]}
          src='/how-it-works-hero.svg'
          height={[300, 320, 450]}
        />

        <Box display={['block', 'none', 'none']} mt={5}>
          <Flex alignItems='center' justifyContent='center'>
            {heroButtons}
          </Flex>
        </Box>
      </Flex>
    </CurvedSection>
  );
});
