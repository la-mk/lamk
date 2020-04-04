import React from 'react';
import { ContactForm } from '../common/ContactForm';
import { Title, Flex } from '@sradevski/blocks-ui';

export const Contact = () => {
  return (
    <Flex
      width='100%'
      flexDirection='column'
      alignItems='center'
      justifyContent='center'
    >
      <Title mb={4} level={2}>
        Any questions?
      </Title>
      <ContactForm />
    </Flex>
  );
};
