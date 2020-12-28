import React from 'react';
import { Box, Heading, Image, Flex, Text } from '@sradevski/blocks-ui';
import { withTheme } from 'styled-components';
import { Trans } from 'react-i18next';
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
        align='center'
        justify='center'
        direction={['column', 'row', 'row']}
      >
        <Box mr={[0, 3, 3]} maxWidth={600}>
          <Heading
            // @ts-ignore
            style={{ whiteSpace: 'pre' }}
            color='secondary'
            as='h1'
            mb={2}
            align={['center', 'start', 'start']}
            size='2xl'
          >
            <Trans t={t} i18nKey='howItWorks.heroSlogan'>
              How&nbsp;
              {/* @ts-ignore */}
              <Text fontSize='inherit' color='primary'>
                It Works
              </Text>
            </Trans>
          </Heading>
          <Text
            as='p'
            mt={4}
            // @ts-ignore
            size={['md', 'lg', 'lg']}
            align={['center', 'start', 'start']}
          >
            {t('howItWorks.heroExplanation')}
          </Text>
          <Box display={['none', 'flex', 'flex']} mt={5}>
            <HeroButtons />
          </Box>
        </Box>
        <Box mt={[3, 0, 0]} ml={[0, 3, 3]} height={[300, 320, 450]}>
          <Image src='/how-it-works-hero.svg' alt='how it works illustration' />
        </Box>

        <Box display={['block', 'none', 'none']} mt={5}>
          <HeroButtons align='center' justify='center' />
        </Box>
      </Flex>
    </CurvedSection>
  );
});
