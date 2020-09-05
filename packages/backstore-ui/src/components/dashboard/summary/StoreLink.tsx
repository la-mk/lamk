import React from 'react';
import { Alert, Button } from '@sradevski/blocks-ui';
import differenceInDays from 'date-fns/differenceInDays';
import { useOneTimeNotice } from '../../shared/hooks/useOneTimeNotice';
import { useSelector } from 'react-redux';
import { getStore } from '../../../state/modules/store/store.selector';
import { Trans, useTranslation } from 'react-i18next';

export const StoreLink = () => {
  const { t } = useTranslation();
  const store = useSelector(getStore);
  const slug = `${store?._id ?? ''}-hide-store-link`;
  const [shouldHide, hideNotice] = useOneTimeNotice(slug);
  const isNewShop =
    store &&
    Math.abs(differenceInDays(new Date(store.createdAt), Date.now())) <= 3;

  if (!store || shouldHide || !isNewShop) {
    return null;
  }

  const storeUrl = `${store.slug}.la.mk`;
  return (
    <Alert
      message={t('store.storeReady')}
      description={
        <Trans
          t={t}
          i18nKey='store.storeReadyExplanation'
          values={{ storeUrl }}
        >
          Your store is now accessible at
          <Button
            p={0}
            type='link'
            href={`https://${storeUrl}`}
            target='_blank'
          >
            {{ storeUrl }}
          </Button>
          check it out!
        </Trans>
      }
      type='info'
      closable
      onClose={hideNotice}
    />
  );
};
