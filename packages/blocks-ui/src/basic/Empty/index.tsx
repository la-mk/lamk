import React from 'react';
import { SpaceProps, useTheme } from '@chakra-ui/react';
import { Flex } from '../Flex';
import { Text } from '../Typography';
import { EmptyIcon } from './EmptyIcon';

export interface EmptyProps extends SpaceProps {
  icon?: React.ReactNode;
  description?: string;
  title?: string;
}

export const Empty = ({ icon, title, description, ...props }: EmptyProps) => {
  const theme = useTheme();
  return (
    <Flex {...props} direction="column" justify="center" align="center">
      {icon ?? (
        <EmptyIcon
          lightPrimary={theme.colors.primary['300']}
          darkPrimary={theme.colors.primary['400']}
        />
      )}
      {title && (
        <Text fontSize={3} mt={2}>
          {title}
        </Text>
      )}
      {description && (
        <Text fontSize={2} color="mutedText.dark" mt={!!title ? 0 : 2}>
          {description}
        </Text>
      )}
    </Flex>
  );
};
