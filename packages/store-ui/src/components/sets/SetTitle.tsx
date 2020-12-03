import React from 'react';
import { Title, Text, Flex } from '@sradevski/blocks-ui';

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
    <Flex mb={4} align='center' justify='center' direction='column'>
      <Title
        textAlign='center'
        mb={1}
        level={2}
        fontSize={emphasized ? [5, 5, 6] : [3, 3, 4]}
      >
        {title.toUpperCase()}
      </Title>
      {subtitle && (
        <Text textAlign='center' fontSize={[2, 2, 3]} color='mutedText.dark'>
          {subtitle}
        </Text>
      )}
    </Flex>
  );
};
