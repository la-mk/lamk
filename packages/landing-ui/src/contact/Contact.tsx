import React from 'react';
import { Box, Flex, Title, Text, Paragraph } from '@sradevski/blocks-ui';
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
          alignItems='center'
          justifyContent='center'
          flexDirection={['column', 'row', 'row']}
          mt={[4, 4, 5]}
        >
          <Box maxWidth={600}>
            <Title
              color='secondary'
              level={1}
              mb={2}
              textAlign={'center'}
              fontSize={[6, 7, 7]}
            >
              <Trans t={t} i18nKey='landingContact.heroSlogan'>
                Contact&nbsp;
                <Text fontSize={[6, 7, 7]} color='primary'>
                  Us
                </Text>
              </Trans>
            </Title>

            <Paragraph
              mt={4}
              fontSize={[2, 3, 3]}
              textAlign={['center', 'center', 'center']}
            >
              {t('landingContact.heroExplanation')}
            </Paragraph>
          </Box>
        </Flex>
      </CurvedSection>

      <Box width='100%' px={[3, 4, 4]} mb={5}>
        <ContactForm />
      </Box>
    </Box>
  );
});
