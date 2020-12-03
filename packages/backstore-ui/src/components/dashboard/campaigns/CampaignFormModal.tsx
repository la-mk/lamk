import cloneDeep from 'lodash/cloneDeep';
import pick from 'lodash/pick';
import React from 'react';
import {
  Button,
  Flex,
  message,
  Spinner,
  Modal,
  hooks,
  NewForm,
} from '@sradevski/blocks-ui';
import { sdk } from '@sradevski/la-sdk';
import { useSelector } from 'react-redux';
import {
  addCampaign,
  patchCampaign,
  removeCampaign,
} from '../../../state/modules/campaigns/campaigns.module';
import { getStore } from '../../../state/modules/store/store.selector';
import { useTranslation } from 'react-i18next';
import { Campaign } from '@sradevski/la-sdk/dist/models/campaign';
import { getGroups } from '../../../state/modules/products/products.selector';
import { FindResult } from '@sradevski/la-sdk/dist/setup';
import { ProductGroup } from '@sradevski/la-sdk/dist/models/productGroup';
import { setGroups } from '../../../state/modules/products/products.module';

interface ProductFormModalProps {
  campaign: Campaign | undefined;
  onClose: () => void;
  visible: boolean;
}

export const CampaignFormModal = ({
  campaign,
  onClose,
  visible,
}: ProductFormModalProps) => {
  const { t } = useTranslation();
  const [caller, showSpinner] = hooks.useCall();
  const store = useSelector(getStore);
  const [groupsCaller] = hooks.useCall();
  const groups: string[] | undefined = useSelector(getGroups);
  const storeId = store ? store._id : undefined;
  // TODO: omitExtraData doesn't work correctly with oneOfs
  const [campaignFormData, setCampaignFormData] = hooks.useFormState<Campaign>(
    campaign
      ? (pick(campaign, [
          'forStore',
          'type',
          'name',
          'isActive',
          'isPromoted',
          'reward',
          'productRules',
        ]) as any)
      : undefined,
    {
      isActive: false,
      isPromoted: false,
      forStore: storeId,
      type: sdk.campaign.CampaignTypes.CART_DISCOUNT,
      reward: {
        type: sdk.campaign.RewardTypes.PERCENTAGE_DISCOUNT,
        value: 10,
      },
      productRules: [{ type: sdk.campaign.ProductRuleTypes.ALL, value: 'all' }],
    },
    [campaign, storeId],
  );

  React.useEffect(() => {
    if (!groups) {
      groupsCaller<FindResult<ProductGroup>>(
        sdk.productGroup.findForStore(storeId),
        productGroups => setGroups(productGroups.data.map(x => x.groupName)),
      );
    }
  }, [groups, groupsCaller, storeId]);

  const handleUpsertCampaign = ({ formData }: { formData: Campaign }) => {
    if (campaign?._id) {
      caller<Campaign>(
        sdk.campaign.patch(campaign._id, formData),
        updatedCampaign => {
          message.success(
            t('campaign.updateCampaignSuccess', {
              campaignName: updatedCampaign.name,
            }),
          );
          onClose();
          return patchCampaign(updatedCampaign);
        },
      );
    } else {
      caller<Campaign>(sdk.campaign.create(formData), campaign => {
        message.success(t('campaign.addCampaignSuccess'));
        onClose();
        return addCampaign(campaign);
      });
    }
  };

  const handleDeleteCampaign = () => {
    if (campaign && campaign._id) {
      caller<Campaign>(sdk.campaign.remove(campaign._id), () => {
        onClose();
        message.success(
          t('campaign.campaignDeleted', {
            id: sdk.utils.getShortId(campaign._id),
          }),
        );
        return removeCampaign(campaign._id);
      });
    }
  };

  const pickedSchema = cloneDeep(
    sdk.utils.schema.pick(sdk.campaign.schema, [
      'forStore',
      'type',
      'name',
      'isActive',
      'isPromoted',
      'reward',
      'productRules',
    ]),
  );

  //TODO: See https://github.com/rjsf-team/react-jsonschema-form/issues/902 why we can't use additionalProperties here.
  pickedSchema.properties.reward.oneOf.forEach((entry: any) => {
    entry.title = t(`campaignRewardTypes.${entry.properties.type.const}`);
  });

  pickedSchema.properties.productRules.items.oneOf.forEach((entry: any) => {
    entry.title = t(`productRuleTypes.${entry.properties.type.const}`);
  });

  return (
    <Modal
      maxWidth={['96%', '60%', '40%']}
      isOpen={visible}
      onClose={onClose}
      header={campaign ? t('actions.update') : t('actions.add')}
    >
      <Spinner
        isLoaded={!showSpinner}
        label={
          campaign
            ? t('campaign.updatingCampaignTip')
            : t('campaign.addingCampaignTip')
        }
      >
        {campaign && (
          <Flex mb={3} justify='flex-end'>
            <Button
              size='sm'
              variant='outline'
              onClick={handleDeleteCampaign}
              isDanger
            >
              {t('actions.delete')}
            </Button>
          </Flex>
        )}

        <NewForm
          omitExtraData={false}
          schema={pickedSchema as any}
          uiSchema={{
            'ui:order': [
              'name',
              'reward',
              'productRules',
              'isActive',
              'isPromoted',
              '*',
            ],
            forStore: {
              'ui:widget': 'hidden',
            },
            type: {
              'ui:widget': 'hidden',
            },
            name: {
              'ui:title': t('common.name'),
              'ui:placeholder': t('campaign.nameExample'),
            },
            isActive: {
              'ui:options': {
                label: t('campaign.active'),
              },
            },
            isPromoted: {
              'ui:help': t('campaign.promotedTip'),
              'ui:options': {
                label: t('campaign.promoted'),
              },
            },
            reward: {
              'ui:title': t('campaign.reward'),
              'ui:options': {
                asOneOf: true,
              },
              type: {
                'ui:widget': 'hidden',
              },
              value: {
                'ui:title': t('campaign.rewardValue'),
                'ui:options': {
                  mt: 2,
                  prefix:
                    (campaignFormData as any)?.reward?.type ===
                    sdk.campaign.RewardTypes.PERCENTAGE_DISCOUNT
                      ? '%'
                      : 'ден',
                },
              },
            },
            productRules: {
              'ui:title': t('campaign.targetProductType'),
              items: {
                'ui:options': {
                  asOneOf: true,
                },
                type: {
                  'ui:widget': 'hidden',
                },
                value: {
                  'ui:title': t('campaign.productsTarget'),
                  'ui:widget': 'select',
                  'ui:options': {
                    mt: 2,
                    // TODO: This won't work for multiple rules
                    customEnumOptions:
                      (campaignFormData as any)?.productRules?.[0]?.type ===
                      sdk.campaign.ProductRuleTypes.ALL
                        ? [{ value: 'all', label: t('productRuleTypes.all') }]
                        : groups?.map(group => ({
                            label: group,
                            value: group,
                          })),
                  },
                },
              },
            },
          }}
          onSubmit={handleUpsertCampaign}
          onChange={({ formData }) => setCampaignFormData(formData)}
          formData={campaignFormData as Campaign}
          getErrorMessage={(errorName, context) =>
            t(`errors.${errorName}`, context)
          }
        >
          <Flex mt={3} justify='center'>
            <Button variant='outline' mr={2} onClick={onClose}>
              {t('actions.cancel')}
            </Button>
            <Button ml={2} type='submit'>
              {campaign ? t('actions.update') : t('actions.add')}
            </Button>
          </Flex>
        </NewForm>
      </Spinner>
    </Modal>
  );
};
