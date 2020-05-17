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
        alignItems='center'
        justifyContent='center'
      >
        <Flex
          width={'80%'}
          alignItems='center'
          justifyContent='center'
          flexDirection='column'
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
            {t('campaignBanners.allDiscountTitle', {
              rewardValue: rewardValueText,
            })}
          </Text>
          <Text fontSize={[0, 0, 1]} color='mutedText.light' textAlign='center'>
            {t('campaignBanners.allDiscountSubtitle')}
          </Text>
        </Flex>
      </Flex>
    );
  },
);
