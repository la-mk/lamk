import React from 'react';
import { Flex, Heading, Text } from '@sradevski/blocks-ui';
import { withTheme } from 'styled-components';
import { CurvedSection } from '../common/CurvedSection';
import { HeroIllustration } from './hero-illustration';
import { Trans } from 'react-i18next';
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
        direction='column'
        align='center'
        justify='center'
        width='100%'
        mt={[4, 4, 5]}
      >
        <Heading align='center' color='secondary' as='h1' mb={2} size='2xl'>
          <Trans t={t} i18nKey='landing.heroSlogan'>
            Online shop
            <Text
              align='center'
              display='block'
              // @ts-ignore d
              fontSize='inherit'
              color='primary'
            >
              In 5 minutes
            </Text>
          </Trans>
        </Heading>
        {/* @ts-ignore */}
        <Text size={['md', 'lg', 'lg']} align={'center'}>
          {t('company.subTagline')}
        </Text>
        <HeroButtons mt={5} />
        <HeroIllustration />
      </Flex>
    </CurvedSection>
  );
});
