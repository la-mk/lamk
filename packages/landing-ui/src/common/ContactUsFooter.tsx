import React from 'react';
import { withTheme } from 'styled-components';
import { CurvedSection } from './CurvedSection';
import { ContactForm } from './ContactForm';
import { Heading, Flex, Image, Box } from '@sradevski/blocks-ui';
import { useTranslation } from './i18n';

export const ContactUsFooter = withTheme(({ theme }) => {
  const { t } = useTranslation();

  return (
    <CurvedSection
      // @ts-ignore
      style={{ position: 'relative' }}
      mt={[6, '6rem', '8rem']}
      direction='up'
      backgroundColor={theme.colors.background.light}
    >
      <Flex
        width='100%'
        mx='auto'
        px={[3, 0, 0]}
        py={3}
        direction='column'
        align='center'
        justify='center'
        // @ts-ignore
        style={{ zIndex: 2 }}
      >
        <Heading as='h3' size='xl' mb={[4, 5, 6]}>
          {t('landing.contactUsPage')}
        </Heading>
        <ContactForm />
      </Flex>
      <Box
        height={['10rem', '14rem', '14rem']}
        display={['none', 'block', 'block']}
        // @ts-ignore
        style={{ zIndex: 1, position: 'absolute', right: '7%', bottom: 250 }}
      >
        <Box height='100%'>
          <Image src='/paper-airplane-trail.svg' alt='Paper airplane trail' />
        </Box>
      </Box>
      <Box
        height={'20rem'}
        display={['none', 'block', 'block']}
        // @ts-ignore
        style={{ position: 'absolute', left: 0, bottom: '-12px' }}
      >
        <Image src='/contact-form-plants.svg' alt='Plants decoration' />
      </Box>
    </CurvedSection>
  );
});
