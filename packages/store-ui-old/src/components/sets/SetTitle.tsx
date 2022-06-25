import React from 'react';
import { Heading, Text, Flex } from '@la-mk/blocks-ui';
import { useTheme } from '@chakra-ui/react';
import { DecoratedHeading } from '../shared/components/DecoratedHeading';

export const SetTitle = ({
  emphasized,
  title,
  subtitle,
}: {
  emphasized?: boolean;
  title: string;
  subtitle?: string;
}) => {
  const theme = useTheme();
  const ownTheme = theme.sections.Sets.heading;

  const HeadingElement =
    ownTheme.variant === 'plain' ? Heading : DecoratedHeading;

  return (
    <Flex mb={6} align='center' justify='center' direction='column'>
      <HeadingElement
        align='center'
        mb={1}
        as='h2'
        size={emphasized ? 'xl' : 'md'}
      >
        {title.toUpperCase()}
      </HeadingElement>
      {subtitle && (
        <Text align='center' size={'lg'} color='mutedText.dark'>
          {subtitle}
        </Text>
      )}
    </Flex>
  );
};
