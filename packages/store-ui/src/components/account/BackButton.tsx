import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button, hooks, Text } from '@la-mk/blocks-ui';
import Link from 'next/link';
import React from 'react';
import { useTranslation } from '../../common/i18n';

export const BackButton = () => {
  const { t } = useTranslation();
  const isMobile = hooks.useBreakpoint([true, false, false]);
  if (!isMobile) {
    return null;
  }

  return (
    <Link href={'/account'} passHref>
      <Button
        mt={1}
        mb={5}
        as='a'
        variant='link'
        leftIcon={
          <Text as='div' size='xs'>
            <ArrowLeftOutlined />
          </Text>
        }
      >
        {t('actions.goToAccount')}
      </Button>
    </Link>
  );
};
