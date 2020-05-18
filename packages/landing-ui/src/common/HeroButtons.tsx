import React from 'react';
import { Flex, Button } from '@sradevski/blocks-ui';
import { useTranslation } from './i18n';

export const HeroButtons = (props: typeof Flex) => {
  const { t } = useTranslation();
  return (
    <Flex {...props}>
      <Button mr={2} type='primary' size='large'>
        {t('actions.startNow')}
      </Button>
      <Button ml={2} size='large'>
        {t('actions.seeDemoShop')}
      </Button>
    </Flex>
  );
};
