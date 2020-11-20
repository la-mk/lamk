import React from 'react';
import { Flex, Heading, Label, Paragraph } from '@sradevski/blocks-ui';
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
          <Heading
            as='p'
            mb={2}
            size={['small', 'small', 'medium']}
            color='contentInversePrimary'
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
          </Heading>
          <Paragraph
            size={['small', 'small', 'medium']}
            color='contentInverseSecondary'
            textAlign='center'
          >
            {t('campaignBanners.setDiscountSubtitle')}
          </Paragraph>
        </Flex>
      </Flex>
    );
  },
);
