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
          mt={[4, 4, 5]}
        >
          <Box maxWidth={600}>
            <Heading
              color='secondary'
              as='h1'
              mb={2}
              align={'center'}
              size={'2xl'}
            >
              <Trans t={t} i18nKey='landingContact.heroSlogan'>
                Contact&nbsp;
                {/* @ts-ignore */}
                <Text fontSize='inherit' color='primary'>
                  Us
                </Text>
              </Trans>
            </Heading>

            <Text
              as='p'
              mt={4}
              // @ts-ignore
              size={['md', 'lg', 'lg']}
              align={['center', 'center', 'center']}
            >
              {t('landingContact.heroExplanation')}
            </Text>
          </Box>
        </Flex>
      </CurvedSection>

      <Box width='100%' px={[3, 4, 4]} mb={5}>
        <ContactForm />
      </Box>
    </Box>
  );
});
