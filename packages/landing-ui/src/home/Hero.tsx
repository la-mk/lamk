import React from 'react';
import { Flex, Title, Button, Text } from '@sradevski/blocks-ui';
import { withTheme } from 'styled-components';
import { CurvedSection } from '../common/CurvedSection';
import { HeroIllustration } from './hero-illustration';
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
        <Title color='secondary' level={1} mb={2} fontSize={[6, 7, 7]}>
          Online shop
          <Text display='block' fontSize={[6, 7, 7]} color='primary'>
            In 5 minutes
          </Text>
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
