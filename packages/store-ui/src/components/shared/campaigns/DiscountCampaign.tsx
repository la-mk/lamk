import React from 'react';
import { Text, Button, Flex } from '@sradevski/blocks-ui';
import { Campaign } from '@sradevski/la-sdk/dist/models/campaign';
import { sdk } from '@sradevski/la-sdk';
import { useDispatch } from 'react-redux';
import { goTo } from '../../../state/modules/navigation/navigation.actions';
import { useTranslation } from '../../../common/i18n';

interface DiscoutCampaignProps {
  campaign: Campaign;
}

export const DiscountCampaign = ({ campaign }: DiscoutCampaignProps) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const rewardValueText =
    campaign.reward.type === sdk.campaign.RewardTypes.PERCENTAGE_DISCOUNT
      ? `${campaign.reward.value}%`
      : `${campaign.reward.value} ден`;

  return (
    <Flex
      width='100%'
      p={3}
      style={{ backgroundColor: '#ebebeb' }}
      alignItems='center'
      justifyContent='center'
    >
      <Text style={{ textAlign: 'center' }}>
        {t('campaignBanners.allDiscount', { rewardValue: rewardValueText })}.
        <Button type='link' onClick={() => dispatch(goTo('/products'))}>
          {t('product.seeAllProducts')}
        </Button>
      </Text>
    </Flex>
  );
};
