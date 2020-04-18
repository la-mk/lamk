import React from 'react';
import { Flex, Title, Button, Text } from '@sradevski/blocks-ui';
import { withTheme } from 'styled-components';
import { CurvedSection } from './CurvedSection';
import { HeroIllustration } from './hero-illustration';

export const Hero = withTheme(({ theme }) => {
  return (
    <CurvedSection
      direction='down'
      backgroundColor={theme.colors.lightBackground}
    >
      <Flex
        flexDirection='column'
        alignItems='center'
        justifyContent='center'
        width='100%'
        mt={[4, 4, 5]}
      >
        <Title color='primary' level={1} mb={2} fontSize={[6, 7, 8]}>
          Online shop
          <Text display='block' color='secondary'>
            In 5 minutes
          </Text>
        </Title>
        <Text fontSize={20} textAlign={'center'} color='secondary'>
          The easiest way to build an online shop
        </Text>
        <Flex mt={5}>
          <Button width={140} mr={2} type='primary' size='large'>
            Start now
          </Button>
          <Button width={140} type='ghost' ml={2} size='large'>
            Watch demo
          </Button>
        </Flex>
        <HeroIllustration />
      </Flex>
    </CurvedSection>
  );
});
