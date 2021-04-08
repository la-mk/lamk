import { Box, Flex, Heading, Text } from '@la-mk/blocks-ui';
import { BlocksTheme } from '@la-mk/blocks-ui/dist/theme';
import React from 'react';
import { withTheme } from '@emotion/react';
import { CurvedSection } from './CurvedSection';

export const HeroTitle = withTheme(
  ({
    theme,
    children,
    description,
  }: {
    theme: BlocksTheme;
    children: React.ReactNode;
    description: string;
  }) => {
    return (
      <CurvedSection
        direction='down'
        backgroundColor={theme.colors.background.light}
      >
        <Flex
          align='center'
          justify='center'
          direction={['column', 'row', 'row']}
          mt={[4, 6, 7]}
          px={3}
        >
          <Box maxWidth={'36rem'}>
            <Heading align='center' color='secondary' as='h1' mb={2} size='3xl'>
              {children}
            </Heading>

            <Text
              as='p'
              mt={6}
              size={'lg'}
              align={['center', 'center', 'center']}
            >
              {description}
            </Text>
          </Box>
        </Flex>
      </CurvedSection>
    );
  },
);
