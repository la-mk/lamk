import React from 'react';
import { Box, Flex, Heading, Text } from '@sradevski/blocks-ui';
import { CurvedSection } from '../common/CurvedSection';
import { withTheme } from 'styled-components';
import { Trans } from 'react-i18next';
import { ContactForm } from '../common/ContactForm';
import { useTranslation } from '../common/i18n';

export const Contact = withTheme(({ theme }) => {
  const { t } = useTranslation();
  return (
    <Box>
      <CurvedSection
        direction='down'
        backgroundColor={theme.colors.background.light}
      >
        <Flex
          align='center'
          justify='center'
          direction={['column', 'row', 'row']}
          mt={[4, 6, 7]}
        >
          <Box maxWidth={'36rem'}>
            <Heading align='center' color='secondary' as='h1' mb={2} size='3xl'>
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
            </Heading>

            <Text
              as='p'
              mt={6}
              size={'lg'}
              align={['center', 'center', 'center']}
            >
              {t('landingContact.heroExplanation')}
            </Text>
          </Box>
        </Flex>
      </CurvedSection>

      <Box width='100%' px={[3, 4, 4]} mb={7}>
        <ContactForm />
      </Box>
    </Box>
  );
});
