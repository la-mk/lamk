import React from 'react';
import { Flex, Button } from '@sradevski/blocks-ui';
import { useTranslation } from './i18n';

export const HeroButtons = ({
  noDemo,
  ...props
}: React.ComponentProps<typeof Flex> & { noDemo?: boolean }) => {
  const { t } = useTranslation();
  return (
    <Flex {...props} style={{ zIndex: 1 }}>
      <Button mr={2} type='primary' size='large' href='https://admin.la.mk'>
        {t('actions.startNow')}
      </Button>
      {!noDemo && (
        <Button
          ml={2}
          size='large'
          target='_blank'
          rel='noreferrer noopener'
          href='https://demo.la.mk'
        >
          {t('actions.seeDemoShop')}
        </Button>
      )}
    </Flex>
  );
};
