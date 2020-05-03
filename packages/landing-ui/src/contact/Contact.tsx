import React from 'react';
import { Box, Flex, Title, Text, Paragraph } from '@sradevski/blocks-ui';
import { CurvedSection } from '../common/CurvedSection';
import { withTheme } from 'styled-components';
import { ContactForm } from '../common/ContactForm';

export const Contact = withTheme(({ theme }) => {
  return (
    <Box>
      <CurvedSection
        direction='down'
        backgroundColor={theme.colors.lightBackground}
      >
        <Flex
          alignItems='center'
          justifyContent='center'
          flexDirection={['column', 'row', 'row']}
          mt={[4, 4, 5]}
        >
          <Box maxWidth={600}>
            <Title
              color='primary'
              level={1}
              mb={2}
              textAlign={'center'}
              fontSize={[6, 6, 7]}
            >
              Contact <Text color='secondary'>Us</Text>
            </Title>

            <Paragraph mt={4} textAlign={['center', 'start', 'start']}>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum
              voluptatibus optio tempora vero, odio velit earum fugiat eveniet
              assumenda ullam ab reprehenderit illo eum dolores omnis
              dignissimos natus, voluptatem maiores.
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
