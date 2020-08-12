import React from 'react';
import {
  Button,
  Flex,
  Col,
  Row,
  message,
  Spin,
  Modal,
  Form,
  FormItem,
  formInput,
  hooks,
  Checkbox,
  Option,
  Select,
  InputNumber,
  Input,
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
import { groupCollapsed } from 'console';
import { getGroups } from '../../../state/modules/products/products.selector';
import { FindResult } from '@sradevski/la-sdk/dist/setup';
import { ProductGroup } from '@sradevski/la-sdk/dist/models/productGroup';
import { setGroups } from '../../../state/modules/products/products.module';

interface ProductFormModalProps {
  campaign: Campaign | undefined;
  onClose: () => void;
  visible: boolean;
}

const currencyParser = (value?: string) =>
  (value ?? '').replace(/[^0-9.]/g, '');

export const CampaignFormModal = ({
  campaign,
  onClose,
  visible,
}: ProductFormModalProps) => {
  const { t } = useTranslation();
  const [caller, showSpinner] = hooks.useCall();
  const store = useSelector(getStore);
  const [groupsCaller, groupsLoading] = hooks.useCall();
  const groups: string[] = useSelector(getGroups);
  const storeId = store ? store._id : undefined;
  const [externalState] = hooks.useFormState<Campaign>(
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
  }, [groups]);

  const handlePatchCampaign = (campaign: Campaign) => {
    caller<Campaign>(sdk.campaign.patch(campaign._id, campaign), campaign => {
      message.success(
        t('campaign.updateCampaignSuccess', { campaignName: campaign.name }),
      );
      onClose();
      return patchCampaign(campaign);
    });
  };

  const handleCreateCampaign = (newCampaign: Campaign) => {
    if (store) {
      caller<Campaign>(sdk.campaign.create(newCampaign), campaign => {
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

        <Form
          colon={false}
          externalState={externalState}
          validate={data => sdk.campaign.validate(data, Boolean(campaign))}
          // TODO: Add single validation when the validation library can handle nested schemas/selectors.
          getErrorMessage={(errorName, context) =>
            t(`errors.${errorName}`, context)
          }
          onFormCompleted={
            campaign ? handlePatchCampaign : handleCreateCampaign
          }
          layout='vertical'
        >
          <Row gutter={24}>
            <Col md={12} span={24}>
              <FormItem label={t('common.name')} selector='name'>
                {formInput({ placeholder: t('campaign.nameExample') })}
              </FormItem>
            </Col>
            <Col md={6} span={12}>
              <FormItem label={t('campaign.reward')} selector='reward.value'>
                {(val: any, onChange, onComplete, newCampaign) => {
                  const isPercentage =
                    newCampaign.reward?.type ===
                    sdk.campaign.RewardTypes.PERCENTAGE_DISCOUNT;
                  const suffix = isPercentage ? '%' : 'ден';

                  return (
                    <InputNumber
                      placeholder={t('campaign.reward')}
                      formatter={value => {
                        return value ? `${value} ${suffix}` : '';
                      }}
                      parser={currencyParser}
                      width='100%'
                      min={0}
                      max={isPercentage ? 100 : 99999999}
                      decimalSeparator='.'
                      value={val}
                      onChange={onChange}
                      onBlur={() => {
                        onComplete(val);
                      }}
                    />
                  );
                }}
              </FormItem>
            </Col>
            <Col md={6} span={12}>
              <FormItem label={t('campaign.reward')} selector='reward.type'>
                {(val: any, _onChange, onComplete) => {
                  return (
                    <Select value={val} onChange={onComplete}>
                      {Object.values(sdk.campaign.RewardTypes).map(option => {
                        return (
                          <Option key={option} value={option}>
                            {t(`campaignRewardTypes.${option}`)}
                          </Option>
                        );
                      })}
                    </Select>
                  );
                }}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col md={12} span={24}>
              <FormItem
                label={t('campaign.targetProductType')}
                selector='productRules'
              >
                {(val, _onChange, onComplete) => {
                  return (
                    <Select
                      value={val[0].type}
                      onChange={type =>
                        onComplete([{ value: val[0].value, type }])
                      }
                    >
                      {Object.values(sdk.campaign.ProductRuleTypes).map(
                        option => {
                          return (
                            <Option key={option} value={option}>
                              {t(`productRuleTypes.${option}`)}
                            </Option>
                          );
                        },
                      )}
                    </Select>
                  );
                }}
              </FormItem>
            </Col>
            <Col md={12} span={24}>
              <FormItem
                label={t('campaign.productsTarget')}
                selector='productRules'
              >
                {(val, _onChange, onComplete) => {
                  const isGroupType =
                    val[0].type === sdk.campaign.ProductRuleTypes.GROUP;
                  const opts = isGroupType ? groups : ['all'];

                  if (!opts.includes(val[0].value)) {
                    onComplete([{ ...val[0], value: opts[0] }]);
                  }

                  return (
                    <Select
                      value={val[0].value}
                      onChange={value =>
                        onComplete([{ type: val[0].type, value }])
                      }
                    >
                      {opts.map(option => {
                        return (
                          <Option key={option} value={option}>
                            {option === 'all'
                              ? t('productRuleTypes.all')
                              : option}
                          </Option>
                        );
                      })}
                    </Select>
                  );
                }}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col md={12} span={24}>
              <FormItem label={t('campaign.active')} selector='isActive'>
                {(val: any, _onChange, onComplete) => (
                  <Checkbox
                    mr={3}
                    checked={val}
                    onChange={e => onComplete(e.target.checked)}
                  >
                    {t('campaign.active')}
                  </Checkbox>
                )}
              </FormItem>
            </Col>
            <Col md={12} span={24}>
              <FormItem
                help={t('campaign.promotedTip')}
                label={t('campaign.promoted')}
                selector='isPromoted'
              >
                {(val: any, _onChange, onComplete) => (
                  <Checkbox
                    mr={3}
                    checked={val}
                    onChange={e => onComplete(e.target.checked)}
                  >
                    {t('campaign.promoted')}
                  </Checkbox>
                )}
              </FormItem>
            </Col>
          </Row>

          <Flex mt={3} justifyContent='center'>
            <Button type='ghost' mr={2} onClick={onClose}>
              {t('actions.cancel')}
            </Button>
            <Button ml={2} htmlType='submit' type='primary'>
              {campaign ? t('actions.update') : t('actions.add')}
            </Button>
          </Flex>
        </Form>
      </Spin>
    </Modal>
  );
};
