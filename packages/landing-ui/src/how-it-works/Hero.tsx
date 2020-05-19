import React from 'react';
import { Box, Paragraph, Title, Image, Flex, Text } from '@sradevski/blocks-ui';
import { withTheme } from 'styled-components';
import { CurvedSection } from '../common/CurvedSection';
import { useTranslation } from '../common/i18n';
import { HeroButtons } from '../common/HeroButtons';

export const Hero = withTheme(({ theme }) => {
  const { t } = useTranslation();

  return (
    <CurvedSection
      direction='down'
      backgroundColor={theme.colors.background.light}
    >
      <Flex
        alignItems='center'
        justifyContent='center'
        flexDirection={['column', 'row', 'row']}
      >
        <Box mr={[0, 3, 3]} maxWidth={600}>
          <Title
            color='secondary'
            level={1}
            mb={2}
            textAlign={['center', 'start', 'start']}
            fontSize={[6, 7, 7]}
          >
            How{' '}
            <Text fontSize={[6, 7, 7]} color='primary'>
              It Works
            </Text>
          </Title>
          <Paragraph mt={4} textAlign={['center', 'start', 'start']}>
            {t('howItWorks.heroExplanation')}
          </Paragraph>
          <Box display={['none', 'flex', 'flex']} mt={5}>
            <HeroButtons />
          </Box>
        </Box>
        <Image
          mt={[3, 0, 0]}
          ml={[0, 3, 3]}
          src='/how-it-works-hero.svg'
          height={[300, 320, 450]}
        />

        <Box display={['block', 'none', 'none']} mt={5}>
          <HeroButtons alignItems='center' justifyContent='center' />
        </Box>
      </Flex>
    </CurvedSection>
  );
});
