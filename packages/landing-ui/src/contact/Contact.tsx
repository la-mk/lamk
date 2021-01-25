import React from 'react';
import { Box, Text } from '@la-mk/blocks-ui';
import { withTheme } from 'styled-components';
import { Trans } from 'react-i18next';
import { ContactForm } from '../common/ContactForm';
import { useTranslation } from '../common/i18n';
import { HeroTitle } from '../common/HeroTitle';

export const Contact = withTheme(({ theme }) => {
  const { t } = useTranslation();
  return (
    <Box>
      <HeroTitle description={t('landingContact.heroExplanation')}>
        <Trans t={t} i18nKey='landingContact.heroSlogan'>
          Contact&nbsp;
          <Text
            lineHeight={1.3}
            align='center'
            // @ts-ignore
            fontSize='inherit'
            color='primary.500'
          >
            Us
          </Text>
        </Trans>
      </HeroTitle>

      <Box width='100%' px={[3, 4, 4]} mb={7}>
        <ContactForm />
      </Box>
    </Box>
  );
});
