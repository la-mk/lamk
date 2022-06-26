import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Spinner,
  Text,
  toast,
} from '@la-mk/blocks-ui';
import { sdk } from '@la-mk/la-sdk';
import { StoreIntegrations } from '@la-mk/la-sdk/dist/models/storeIntegrations';
import { FindResult } from '@la-mk/la-sdk/dist/setup';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getStore } from '../../../state/modules/store/store.selector';
import { IntegrationDetails } from './IntegrationDetails';
import { IntegrationCard } from './IntegrationCard';
import { TFunction } from 'i18next';
import { useCall } from '../../shared/hooks/useCall';

export interface Integration {
  config: IntegrationConfiguration;
  value?: any;
  slug: string;
}

export interface IntegrationConfiguration {
  name: string;
  description: string;
  logo: string;
  uiSchema: any;
  steps: React.ReactNode[];
}

const getSupportedIntegrations = (
  t: TFunction,
): { [k: string]: IntegrationConfiguration } => {
  return {
    facebookChat: {
      name: 'Facebook Chat',
      description: t('integrations.facebookChatDescription'),
      logo: '/integrations/facebook-chat.png',
      uiSchema: {
        facebookChat: {
          pageId: {
            'ui:title': 'Page ID',
          },
        },
      },
      steps: [
        <Text>
          <Trans t={t} i18nKey='integrations.facebookChatStep1'>
            Go to your
            <Button
              as='a'
              variant='link'
              target='_blank'
              rel='noreferrer noopener'
              href='https://business.facebook.com/latest/inbox/chat_plugin'
            >
              Facebook business page
            </Button>
            and log in if you haven't already
          </Trans>
        </Text>,
        <Text>
          <Trans t={t} i18nKey='integrations.facebookChatStep2'>
            In the <Text as='strong'>"Website Domain"</Text> section, click on
            the edit button, and add your store domains{' '}
            <Text as='u'>https://demo.la.mk</Text>{' '}
            <Text as='u'>https://la.mk</Text>
          </Trans>
        </Text>,
        <Text>
          <Trans t={t} i18nKey='integrations.facebookChatStep3'>
            Customize the frequently asked questions and appearance in the other
            sections of the page
          </Trans>
        </Text>,
        <Text>
          <Trans t={t} i18nKey='integrations.facebookChatStep4'>
            Find your <Text as='strong'>Facebook Page ID</Text> and input it
            below (for a guide on how to find your
            <Text as='strong'>Page ID</Text>, check
            <Button
              as='a'
              target='_blank'
              rel='noreferrer noopener'
              variant='link'
              href='https://www.facebook.com/help/1503421039731588'
            >
              this link
            </Button>
            )
          </Trans>
        </Text>,
      ],
    },
  };
};

export const Integrations = () => {
  const { t } = useTranslation();
  const [fetchCaller, isLoading] = useCall();
  const [patchCaller, isPatching] = useCall();
  const store = useSelector(getStore);
  const storeId = store?._id;
  const [selectedIntegration, setSelectedIntegration] = React.useState<
    Integration | undefined
  >();
  const [existingIntegrations, setExistingIntegrations] = React.useState<
    StoreIntegrations | undefined
  >();

  const supportedIntegrations = React.useMemo(
    () => getSupportedIntegrations(t),
    [t],
  );

  const listOfExistingIntegrations = React.useMemo(
    () =>
      existingIntegrations
        ? Object.entries(existingIntegrations.services)
            .map(([key, val]) => ({
              slug: key,
              value: val,
              config: supportedIntegrations[key],
            }))
            .filter(x => !!x.value)
        : [],
    [supportedIntegrations, existingIntegrations],
  );

  const listOfSupportedIntegrations = React.useMemo(
    () =>
      Object.entries(supportedIntegrations).map(([key, val]) => ({
        slug: key,
        value: undefined,
        config: supportedIntegrations[key],
      })),
    [supportedIntegrations],
  );

  React.useEffect(() => {
    if (!storeId) {
      return;
    }

    fetchCaller<FindResult<StoreIntegrations>>(
      sdk.storeIntegrations.findForStore(storeId),
      x => setExistingIntegrations(x.data[0]),
    );
  }, [storeId, fetchCaller, setExistingIntegrations]);

  const updateIntegrations = (
    updatedIntegrationServices: StoreIntegrations['services'],
  ) => {
    if (!existingIntegrations?._id) {
      return;
    }

    patchCaller(
      sdk.storeIntegrations.patch(existingIntegrations?._id, {
        services: updatedIntegrationServices,
      }),
      (updated: StoreIntegrations) => {
        toast.success(t('integrations.integrationUpdateSuccess'));
        setSelectedIntegration(undefined);
        return setExistingIntegrations(updated);
      },
    );
  };

  return (
    <Flex direction='column' px={[3, 4, 5]} py={5}>
      <Box mb={4}>
        <Heading mb={5} size='md' as='h2'>
          {t('integrations.existingIntegrations')}
        </Heading>
        <Spinner isLoaded={!isLoading}>
          {!isLoading && listOfExistingIntegrations.length === 0 && (
            <Text color='mutedText.dark'>
              {t('integrations.noIntegrationsFound')}
            </Text>
          )}

          {listOfExistingIntegrations.length > 0 && (
            <Grid mt={3} spacing={5} minChildWidth='280px'>
              {listOfExistingIntegrations.map(i => (
                <IntegrationCard
                  isDisabled={false}
                  onSelect={setSelectedIntegration}
                  integration={i}
                />
              ))}
            </Grid>
          )}
        </Spinner>
      </Box>

      <Box mt={8}>
        <Heading mb={5} size='md' as='h2'>
          {t('integrations.supportedIntegrations')}
        </Heading>
        <Grid spacing={5} minChildWidth='280px'>
          {listOfSupportedIntegrations.map(i => (
            <IntegrationCard
              isDisabled={
                isLoading ||
                listOfExistingIntegrations.some(x => x.slug === i.slug)
              }
              onSelect={setSelectedIntegration}
              integration={i}
            />
          ))}
        </Grid>
      </Box>

      {selectedIntegration && (
        <IntegrationDetails
          isPatching={isPatching}
          integration={selectedIntegration}
          onClose={() => setSelectedIntegration(undefined)}
          onUpdate={updated => {
            updateIntegrations({
              ...existingIntegrations?.services,
              ...updated,
            });
          }}
        />
      )}
    </Flex>
  );
};
