import { Text } from '@la-mk/blocks-ui';
import React from 'react';

export const Timestamp = ({ timestamp }: { timestamp: string | number }) => {
  return (
    <Text size='sm' color='mutedText.dark'>
      {new Intl.DateTimeFormat('mk-MK', {
        // @ts-ignore
        dateStyle: 'full',
        timeStyle: 'short',
      }).format(new Date(timestamp))}
    </Text>
  );
};
