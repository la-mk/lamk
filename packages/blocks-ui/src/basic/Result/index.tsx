import React from 'react';
import { SpaceProps, useTheme } from '@chakra-ui/react';
import { Flex } from '../Flex';
import { Text } from '../Typography';
import { EmptyIcon } from './default-icons/EmptyIcon';
import { NotFoundIcon } from './default-icons/NotFoundIcon';
import {
  CheckCircleFilled,
  ExclamationCircleFilled,
  WarningFilled,
} from '@ant-design/icons';

export interface ResultProps extends SpaceProps {
  status: 'empty' | 'success' | 'warning' | 'error' | '404' | '500';
  icon?: React.ReactNode;
  description?: string;
  title?: string;
}

export const Result = ({
  icon,
  title,
  description,
  status,
  ...props
}: ResultProps) => {
  const theme = useTheme();
  return (
    <Flex {...props} direction="column" justify="center" align="center">
      {icon ?? null}
      {!icon && status === 'empty' && (
        <EmptyIcon
          lightPrimary={theme.colors.primary['300']}
          darkPrimary={theme.colors.primary['400']}
        />
      )}
      {!icon && status === 'success' && (
        <CheckCircleFilled
          style={{ fontSize: 72, color: theme.colors.green['500'] }}
        />
      )}
      {!icon && status === 'warning' && (
        <WarningFilled
          style={{ fontSize: 72, color: theme.colors.orange['500'] }}
        />
      )}
      {!icon &&
        (status === 'error' ||
          (status === '500' && (
            <ExclamationCircleFilled
              style={{ fontSize: 72, color: theme.colors.red['500'] }}
            />
          )))}
      {!icon && status === '404' && <NotFoundIcon />}

      {title && (
        <Text fontSize={4} mt={2} textAlign="center">
          {title}
        </Text>
      )}
      {description && (
        <Text
          fontSize={0}
          textAlign="center"
          color="mutedText.dark"
          mt={!!title ? 0 : 2}
        >
          {description}
        </Text>
      )}
    </Flex>
  );
};
