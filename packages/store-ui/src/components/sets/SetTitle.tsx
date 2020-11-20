import React from 'react';
import { Heading, Paragraph, Flex } from '@sradevski/blocks-ui';

export const SetTitle = ({
  emphasized,
  title,
  subtitle,
}: {
  emphasized?: boolean;
  title: string;
  subtitle?: string;
}) => {
  return (
    <Flex
      mb={4}
      alignItems='center'
      justifyContent='center'
      flexDirection='column'
    >
      <Heading
        textAlign='center'
        mb={1}
        as='h2'
        size={
          emphasized
            ? ['medium', 'medium', 'large']
            : ['small', 'small', 'medium']
        }
      >
        {title.toUpperCase()}
      </Heading>
      {subtitle && (
        <Paragraph
          textAlign='center'
          size={['medium', 'medium', 'large']}
          color='contentSecondary'
        >
          {subtitle}
        </Paragraph>
      )}
    </Flex>
  );
};
