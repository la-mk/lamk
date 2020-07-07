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
      backgroundColor={theme.colors.background.light}
    >
      <Flex
        width='100%'
        mx='auto'
        px={[2, 0, 0]}
        flexDirection='column'
        alignItems='center'
        justifyContent='center'
        style={{ zIndex: 2 }}
      >
        <Title level={3} fontSize={[5, 6, 6]} mb={[3, 4, 4]}>
          {t('landing.contactUsPage')}
        </Title>
        <ContactForm />
      </Flex>
      <Box
        height={[150, 240, 240]}
        display={['none', 'block', 'block']}
        style={{ zIndex: 1, position: 'absolute', right: '7%', bottom: 250 }}
      >
        <Box height='100%'>
          <Image src='/paper-airplane-trail.svg' alt='Paper airplane trail' />
        </Box>
      </Box>
      <Box
        height={300}
        display={['none', 'block', 'block']}
        style={{ position: 'absolute', left: 0, bottom: -10 }}
      >
        <Image src='/contact-form-plants.svg' alt='Plants decoration' />
      </Box>
    </CurvedSection>
  );
});
