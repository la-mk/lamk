import React from 'react';
import { withTheme } from 'styled-components';
import { CurvedSection } from './CurvedSection';
import { ContactForm } from './ContactForm';
import { Title, Flex, Image, Box } from '@sradevski/blocks-ui';
import { useTranslation } from './i18n';

export const ContactUsFooter = withTheme(({ theme }) => {
  const { t } = useTranslation();

  return (
    <CurvedSection
      style={{ position: 'relative' }}
      mt={[80, 100, 120]}
      direction='up'
      backgroundColor={theme.colors.tertiary}
    >
      <Flex
        width='100%'
        flexDirection='column'
        alignItems='center'
        justifyContent='center'
        style={{ zIndex: 2 }}
      >
        <Title level={3}>{t('landing.contactUsPage')}</Title>
        <ContactForm />
      </Flex>
      <Box
        display={['none', 'block', 'block']}
        style={{ zIndex: 1, position: 'absolute', right: '7%', bottom: 250 }}
      >
        <Image height={[150, 240, 240]} src='/paper-airplane-trail.svg' />
      </Box>
      <Box style={{ position: 'absolute', right: 0, bottom: 20 }}>
        <Image height={450} src='/contact-form-spill.svg' />
      </Box>
      <Box
        display={['none', 'block', 'block']}
        style={{ position: 'absolute', left: 0, bottom: -10 }}
      >
        <Image height={300} src='/contact-form-plants.svg' />
      </Box>
    </CurvedSection>
  );
});
