import cloneDeep from 'lodash/cloneDeep';
import React from 'react';
import {
  Button,
  Flex,
  message,
  Spin,
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
  const [campaignFormData, setCampaignFormData] = hooks.useFormState<Campaign>(
    campaign,
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
      'name',
      'isActive',
      'isPromoted',
      'reward',
      'productRules',
    ]),
  );
  // See https://github.com/rjsf-team/react-jsonschema-form/issues/902 why we can't use additionalProperties here.
  delete pickedSchema.properties.reward.additionalProperties;
  delete pickedSchema.properties.productRules.items.additionalProperties;

  return (
    <Modal
      width={'80%'}
      centered
      destroyOnClose
      visible={visible}
      footer={null}
      onCancel={onClose}
      title={campaign ? t('actions.update') : t('actions.add')}
    >
      <Spin
        spinning={showSpinner}
        tip={
          campaign
            ? t('campaign.updatingCampaignTip')
            : t('campaign.addingCampaignTip')
        }
      >
        {campaign && (
          <Flex mb={3} justifyContent='flex-end'>
            <Button onClick={handleDeleteCampaign} danger>
              {t('actions.delete')}
            </Button>
          </Flex>
        )}

        <NewForm
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
              type: {
                'ui:title': t('campaign.reward'),
                'ui:widget': 'select',
                'ui:options': {
                  customEnumOptions: Object.values(
                    sdk.campaign.RewardTypes,
                  ).map(rewardType => ({
                    value: rewardType,
                    label: t(`campaignRewardTypes.${rewardType}`),
                  })),
                },
              },
              value: {
                'ui:title': t('campaign.rewardValue'),
              },
            },
            productRules: {
              items: {
                type: {
                  'ui:title': t('campaign.targetProductType'),
                  'ui:widget': 'select',
                  'ui:options': {
                    customEnumOptions: Object.values(
                      sdk.campaign.ProductRuleTypes,
                    ).map(ruleType => ({
                      value: ruleType,
                      label: t(`productRuleTypes.${ruleType}`),
                    })),
                  },
                },
                // TODO: When the type changes, the value should reset to whatever is possible. See https://github.com/rjsf-team/react-jsonschema-form/pull/1564
                value: {
                  'ui:title': t('campaign.productsTarget'),
                  'ui:widget': 'select',
                  'ui:options': {
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
          <Flex mt={3} justifyContent='center'>
            <Button type='ghost' mr={2} onClick={onClose}>
              {t('actions.cancel')}
            </Button>
            <Button ml={2} htmlType='submit' type='primary'>
              {campaign ? t('actions.update') : t('actions.add')}
            </Button>
          </Flex>
        </NewForm>
      </Spin>
    </Modal>
  );
};
