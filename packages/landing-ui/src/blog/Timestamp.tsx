import { Text } from '@la-mk/blocks-ui';
import React from 'react';
import { format } from 'date-fns';
import { mk, enUS } from 'date-fns/locale';
import { useTranslation } from '../common/i18n';

export const Timestamp = ({ timestamp }: { timestamp: string | number }) => {
  const { i18n } = useTranslation();

  return (
    <Text size='sm' color='mutedText.dark'>
      {
        // TODO: Handle locales better
        format(new Date(timestamp), 'PPPP', {
          locale: i18n.language === 'mk' ? mk : enUS,
        })
      }
    </Text>
  );
};
