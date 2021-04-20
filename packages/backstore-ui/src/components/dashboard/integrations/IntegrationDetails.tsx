import { Button, Flex, List, Modal, NewForm, Spinner } from '@la-mk/blocks-ui';
import { sdk } from '@la-mk/la-sdk';
import { StoreIntegrations } from '@la-mk/la-sdk/dist/models/storeIntegrations';
import React from 'react';
import { useTranslation } from 'react-i18next';
import type { Integration } from './Integrations';

export const IntegrationDetails = ({
  integration,
  onClose,
  onUpdate,
  isPatching,
}: {
  integration: Integration;
  onClose: () => void;
  onUpdate: (updated: Integration['value']) => void;
  isPatching: boolean;
}) => {
  const { t } = useTranslation();

  return (
    <Modal
      maxWidth={['98%', '88%', '80%']}
      isOpen={Boolean(integration)}
      onClose={onClose}
      header={t('common.details')}
    >
      <Spinner isLoaded={!isPatching}>
        {integration && (
          <Flex justify='flex-end'>
            <Button
              m={0}
              size='sm'
              variant='outline'
              onClick={() => onUpdate({ [integration.slug]: null })}
              isDanger
            >
              {t('actions.remove')}
            </Button>
          </Flex>
        )}

        <List
          mt={3}
          mb={5}
          variant='ordered'
          items={integration?.config.steps.map(s => ({ content: s }))}
        />
        <NewForm<StoreIntegrations['services']['facebookChat']>
          // @ts-ignore
          formData={{ [integration.slug]: integration.value }}
          schema={sdk.utils.schema.pick(
            sdk.storeIntegrations.schema.properties?.services,
            [integration.slug],
          )}
          uiSchema={integration.config.uiSchema}
          onSubmit={({ formData }) => onUpdate(formData as any)}
          getErrorMessage={(errorName, context) =>
            t(`errors.${errorName}`, context)
          }
        >
          <Flex mt={3} justify='center'>
            <Button variant='outline' mr={2} onClick={onClose}>
              {t('actions.cancel')}
            </Button>
            <Button ml={2} type='submit'>
              {integration.value
                ? t('actions.updateIntegration')
                : t('actions.addIntegration')}
            </Button>
          </Flex>
        </NewForm>
      </Spinner>
    </Modal>
  );
};
