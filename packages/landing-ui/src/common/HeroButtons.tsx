import React from 'react';
import { Flex, Button } from '@sradevski/blocks-ui';
import { useTranslation } from './i18n';

export const HeroButtons = ({
  noDemo,
  ...props
}: React.ComponentProps<typeof Flex> & { noDemo?: boolean }) => {
  const { t } = useTranslation();
  return (
    // @ts-ignore
    <Flex {...props} style={{ zIndex: 1 }}>
      <Button
        as='a'
        mr={2}
        variant='solid'
        size='lg'
        href='https://admin.la.mk'
      >
        {t('actions.startNow')}
      </Button>
      {!noDemo && (
        <Button
          ml={2}
          as='a'
          size='lg'
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
