import React from "react";
import { Flex, Text, Divider, Button, Box, Textarea } from "@la-mk/blocks-ui";
import Link from "next/link";
import { Delivery } from "../../../domain/delivery";
import { Campaign } from "../../../domain/campaign";
import { useTranslation } from "next-i18next";
import { calculatePrices, OrderItem } from "../../../domain/order";
import { CustomCard } from "../../../components/CustomCard";
import { useAuth } from "../../../hooks/useAuth";
import { Store } from "../../../domain/store";
import { SummaryProductList } from "../../../components/product/SummaryProductList";

interface SummaryProps {
  store: Store;
  items: OrderItem[];
  delivery: Delivery;
  campaigns: Campaign[];
  currency: string;
  buttonTitle?: string;
  disabled?: boolean;
  showProductsSummary?: boolean;
  onCheckout?: (options?: { buyerNote?: string }) => void;
  showContinueShopping?: boolean;
  hideFreeShipping?: boolean;
  title?: string;
}

export const Summary = ({
  items,
  store,
  delivery,
  campaigns,
  currency,
  buttonTitle,
  disabled,
  showProductsSummary,
  onCheckout,
  showContinueShopping,
  hideFreeShipping,
  ...props
}: SummaryProps & React.ComponentProps<typeof Box>) => {
  const { user, login } = useAuth();
  const [note, setNote] = React.useState("");
  const { t } = useTranslation("translation");

  const prices = calculatePrices(items, delivery, campaigns);
  const handleCheckout = () => {
    if (!user) {
      login();
    } else {
      onCheckout?.(note ? { buyerNote: note } : undefined);
    }
  };

  return (
    <CustomCard
      height="fit-content"
      minWidth={["18rem", "22rem", "22rem"]}
      width="100%"
      title={t("common.summary")}
      {...props}
    >
      {showProductsSummary && (
        <>
          <SummaryProductList
            items={items}
            currency={currency}
            storeId={store._id}
          />
          <Divider my={4} />
        </>
      )}

      <Flex justify="space-between">
        <Text>{t("finance.subtotal")}</Text>
        <Text as="strong">
          {prices.productsTotal} {t(`currencies.${currency}`)}
        </Text>
      </Flex>

      {prices.withCampaignsTotal !== prices.productsTotal && (
        <Flex mt={4} direction="row" justify="space-between">
          <Text>{t("finance.campaignDiscount")}</Text>
          <Text as="strong" color="danger">
            {(prices.withCampaignsTotal - prices.productsTotal).toFixed(1)}{" "}
            {t(`currencies.${currency}`)}
          </Text>
        </Flex>
      )}

      <Flex mt={4} direction="row" justify="space-between">
        <Text>{t("finance.shippingCost")}</Text>
        <Text as="strong">
          {prices.deliveryTotal} {t(`currencies.${currency}`)}
        </Text>
      </Flex>
      {prices.deliveryTotal !== 0 && !hideFreeShipping && (
        <Box mt={2}>
          <Text size="sm" color="mutedText.dark">
            {t("delivery.addToGetFreeDelivery", {
              priceUntilFreeDelivery: `${
                delivery.freeDeliveryOver - prices.withCampaignsTotal
              } ${t(`currencies.${currency}`)}`,
            })}
          </Text>
        </Box>
      )}

      <Divider my={4} />
      <Flex direction="row" justify="space-between">
        <Text>{t("finance.total")}</Text>
        <Text as="strong" size="xl">
          {prices.total} {t(`currencies.${currency}`)}
        </Text>
      </Flex>

      {onCheckout && showContinueShopping && (
        <Textarea
          mt={6}
          rows={4}
          resize="none"
          placeholder={t("cart.leaveNote")}
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      )}

      {onCheckout && (
        <Button
          isDisabled={disabled}
          onClick={handleCheckout}
          isFullWidth
          size="lg"
          mt={4}
        >
          {buttonTitle}
        </Button>
      )}
      {showContinueShopping && (
        <Link href="/products" passHref>
          <Button as="a" variant="outline" isFullWidth size="lg" mt={4}>
            {t("product.seeOtherProducts")}
          </Button>
        </Link>
      )}
    </CustomCard>
  );
};
