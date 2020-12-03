import React from 'react';
import { Text, Flex } from '@sradevski/blocks-ui';
import { Campaign } from '@sradevski/la-sdk/dist/models/campaign';
import { sdk } from '@sradevski/la-sdk';
import { useTranslation } from '../../../common/i18n';
import { withTheme } from 'styled-components';
import { BlocksTheme } from '@sradevski/blocks-ui/dist/theme';

interface DiscoutCampaignProps {
  campaign: Campaign;
  theme: BlocksTheme;
}

export const DiscountCampaign = withTheme(
  ({ campaign, theme }: DiscoutCampaignProps) => {
    const { t } = useTranslation();

    const rewardValueText =
      campaign.reward.type === sdk.campaign.RewardTypes.PERCENTAGE_DISCOUNT
        ? `${campaign.reward.value}%`
        : `${campaign.reward.value} ден`;

    return (
      <Flex
        width='100%'
        minHeight={250}
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
          borderRadius={0}
          p={3}
        >
          <Text
            mb={2}
            fontSize={[3, 3, 4]}
            color='text.light'
            textAlign='center'
          >
            {t('campaignBanners.setDiscountTitle', {
              rewardValue: rewardValueText,
              productsTarget: (campaign.productRules[0].type ===
              sdk.campaign.ProductRuleTypes.ALL
                ? t('productRuleTypes.all')
                : t('common.selected')
              ).toLowerCase(),
            })}
          </Text>
          <Text fontSize={[0, 0, 1]} color='mutedText.light' textAlign='center'>
            {t('campaignBanners.setDiscountSubtitle')}
          </Text>
        </Flex>
      </Flex>
    );
  },
);
