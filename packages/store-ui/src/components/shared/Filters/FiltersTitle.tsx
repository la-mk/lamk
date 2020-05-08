import React from 'react';
import { Flex, Title, Button } from '@sradevski/blocks-ui';
import { useTranslation } from '../../../common/i18n';

export const FiltersTitle = ({
  title,
  onReset,
}: {
  title: string;
  onReset: () => void;
}) => {
  const { t } = useTranslation();
  return (
    <Flex mb={3} alignItems='center' justifyContent='space-between'>
      <Title m={0} level={3}>
        {title}
      </Title>
      <Button type='link' onClick={onReset}>
        {t('actions.reset')}
      </Button>
    </Flex>
  );
};
