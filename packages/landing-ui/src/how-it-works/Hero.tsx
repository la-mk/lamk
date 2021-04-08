import React from 'react';
import { Box, Heading, Image, Flex, Text, hooks } from '@la-mk/blocks-ui';
import { withTheme } from '@emotion/react';
import { Trans } from 'react-i18next';
import { CurvedSection } from '../common/CurvedSection';
import { useTranslation } from '../common/i18n';
import { HeroButtons } from '../common/HeroButtons';
import { FinalBlocksTheme } from '@la-mk/blocks-ui/dist/theme';

export const Hero = withTheme(({ theme }: { theme: FinalBlocksTheme }) => {
  const { t } = useTranslation();
  const headingAlign = hooks.useBreakpoint<'start' | 'center'>([
    'center',
    'start',
    'start',
  ]);

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
        <Box mr={[0, 5, 5]} maxWidth={['34rem', '26rem', '34rem']}>
          <Heading
            align={headingAlign}
            color='secondary'
            as='h1'
            mb={2}
            size='3xl'
          >
            <Trans t={t} i18nKey='howItWorks.heroSlogan'>
              How&nbsp;
              <Text
                lineHeight={1.3}
                align='center'
                // @ts-ignore
                fontSize='inherit'
                color='primary.500'
              >
                It Works
              </Text>
            </Trans>
          </Heading>

          <Text as='p' mt={6} size={'lg'} align={['center', 'start', 'start']}>
            {t('howItWorks.heroExplanation')}
          </Text>

          <Box display={['none', 'flex', 'flex']} mt={7}>
            <HeroButtons />
          </Box>
        </Box>
        <Box mt={[5, 0, 0]} ml={[0, 5, 5]} height={['20rem', '22rem', '28rem']}>
          <Image src='/how-it-works-hero.svg' alt='how it works illustration' />
        </Box>

        <Box display={['block', 'none', 'none']} mt={7}>
          <HeroButtons align='center' justify='center' />
        </Box>
      </Flex>
    </CurvedSection>
  );
});
