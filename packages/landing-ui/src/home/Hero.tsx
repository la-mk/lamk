import React from 'react';
import { Flex, Title, Text } from '@sradevski/blocks-ui';
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
        flexDirection='column'
        alignItems='center'
        justifyContent='center'
        width='100%'
        mt={[4, 4, 5]}
      >
        <Title
          textAlign='center'
          color='secondary'
          level={1}
          mb={2}
          fontSize={[6, 7, 7]}
        >
          <Trans t={t} i18nKey='landing.heroSlogan'>
            Online shop
            <Text
              textAlign='center'
              display='block'
              fontSize={[6, 7, 7]}
              color='primary'
            >
              In 5 minutes
            </Text>
          </Trans>
        </Title>
        <Text fontSize={[2, 3, 3]} textAlign={'center'}>
          {t('company.subTagline')}
        </Text>
        <HeroButtons mt={5} />
        <HeroIllustration />
      </Flex>
    </CurvedSection>
  );
});
