import { hooks, FacebookChat } from '@la-mk/blocks-ui';
import { sdk } from '@la-mk/la-sdk';
import { Store } from '@la-mk/la-sdk/dist/models/store';
import { StoreIntegrations } from '@la-mk/la-sdk/dist/models/storeIntegrations';
import { FindResult } from '@la-mk/la-sdk/dist/setup';
import React, { useEffect, useState } from 'react';

export const Integrations = ({ store }: { store: Store }) => {
  const [fetchCaller] = hooks.useCall();
  const [integrations, setIntegrations] = useState<StoreIntegrations>();

  useEffect(() => {
    if (!store?._id) {
      return;
    }

    fetchCaller<FindResult<StoreIntegrations>>(
      sdk.storeIntegrations.findForStore(store?._id),
      x => setIntegrations(x.data[0]),
    );
  }, [store?._id, fetchCaller, setIntegrations]);

  return (
    <>
      {integrations?.services?.facebookChat?.pageId && (
        <FacebookChat pageId={integrations.services.facebookChat.pageId} />
      )}
    </>
  );
};
