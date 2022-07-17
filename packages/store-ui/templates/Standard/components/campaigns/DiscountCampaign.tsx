import React from "react";
import { Text, Flex } from "@la-mk/blocks-ui";
import { Store } from "../../../../domain/store";
import {
  Campaign,
  ProductRuleTypes,
  RewardTypes,
} from "../../../../domain/campaign";
import { useTranslation } from "next-i18next";

interface DiscoutCampaignProps {
  store: Store;
  campaign: Campaign;
}

export const DiscountCampaign = ({ store, campaign }: DiscoutCampaignProps) => {
  const { t } = useTranslation("translation");

  const rewardValueText =
    campaign.reward.type === RewardTypes.PERCENTAGE_DISCOUNT
      ? `${campaign.reward.value}%`
      : `${campaign.reward.value} ${t(
          `currencies.${store.preferences?.currency ?? "mkd"}`
        )}`;

  return (
    <Flex
      width="100%"
      minHeight={"14rem"}
      bg="background.light"
      align="center"
      justify="center"
    >
      <Flex
        width={"80%"}
        align="center"
        justify="center"
        direction="column"
        bg="background.dark"
        // @ts-ignore
        borderRadius="md"
        p={5}
      >
        <Text mb={2} size={"2xl"} color="text.light" align="center">
          {t("campaignBanners.setDiscountTitle", {
            rewardValue: rewardValueText,
            productsTarget: (campaign.productRules[0].type ===
            ProductRuleTypes.ALL
              ? t("productRuleTypes.all")
              : t("common.selected")
            ).toLowerCase(),
          })}
        </Text>
        <Text size={"sm"} color="mutedText.light" align="center">
          {t("campaignBanners.setDiscountSubtitle")}
        </Text>
      </Flex>
    </Flex>
  );
};
