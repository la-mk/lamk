import React from 'react';
import { Text, Flex } from '@la-mk/blocks-ui';
import { Campaign } from '@la-mk/la-sdk/dist/models/campaign';
import { sdk } from '@la-mk/la-sdk';
import { useTranslation } from '../../../common/i18n';

interface DiscoutCampaignProps {
  campaign: Campaign;
}

export const DiscountCampaign = ({ campaign }: DiscoutCampaignProps) => {
  const { t } = useTranslation();

  const rewardValueText =
    campaign.reward.type === sdk.campaign.RewardTypes.PERCENTAGE_DISCOUNT
      ? `${campaign.reward.value}%`
      : `${campaign.reward.value} ден`;

  return (
    <Flex
      width='100%'
      minHeight={'14rem'}
      bg='background.light'
      align='center'
      justify='center'
    >
      <Flex
        width={'80%'}
        align='center'
        justify='center'
        direction='column'
        bg='background.dark'
        // @ts-ignore
        borderRadius='md'
        p={5}
      >
        <Text mb={2} size={'2xl'} color='text.light' align='center'>
          {t('campaignBanners.setDiscountTitle', {
            rewardValue: rewardValueText,
            productsTarget: (campaign.productRules[0].type ===
            sdk.campaign.ProductRuleTypes.ALL
              ? t('productRuleTypes.all')
              : t('common.selected')
            ).toLowerCase(),
          })}
        </Text>
        <Text size={'sm'} color='mutedText.light' align='center'>
          {t('campaignBanners.setDiscountSubtitle')}
        </Text>
      </Flex>
    </Flex>
  );
};
