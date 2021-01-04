import React from 'react';
import { Flex, Heading, Text } from '@la-mk/blocks-ui';
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
        mt={[4, 6, 7]}
      >
        <Heading align='center' color='secondary' as='h1' mb={2} size='3xl'>
          <Trans t={t} i18nKey='landing.heroSlogan'>
            Online shop
            <Text
              lineHeight={1.3}
              align='center'
              display='block'
              // @ts-ignore
              fontSize='inherit'
              color='primary.500'
            >
              In 5 minutes
            </Text>
          </Trans>
        </Heading>
        <Text color='mutedText.dark' size={'lg'} align={'center'}>
          {t('company.subTagline')}
        </Text>
        <HeroButtons mt={7} />
        <HeroIllustration />
      </Flex>
    </CurvedSection>
  );
});
