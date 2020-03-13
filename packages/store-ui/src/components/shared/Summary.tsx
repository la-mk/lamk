import React, { useEffect } from 'react';
import { Flex, Text, Divider, Button, message } from '@sradevski/blocks-ui';
import { CartItemWithProduct } from '@sradevski/la-sdk/dist/models/cart';
import { Delivery } from '@sradevski/la-sdk/dist/models/delivery';
import { useSelector, useDispatch } from 'react-redux';
import { getUser } from '../../state/modules/user/user.selector';
import { toggleAuthModal } from '../../state/modules/ui/ui.module';
import { OrderItem } from '@sradevski/la-sdk/dist/models/order';
import { useTranslation } from '../../common/i18n';
import { sdk } from '@sradevski/la-sdk';
import { Campaign } from '@sradevski/la-sdk/dist/models/campaign';

interface SummaryProps {
  items: (CartItemWithProduct | OrderItem)[];
  delivery: Delivery;
  campaigns: Campaign[];
  buttonTitle?: string;
  disabled?: boolean;
  onCheckout?: () => void;
}

export const Summary = ({
  items,
  delivery,
  campaigns,
  buttonTitle,
  disabled,
  onCheckout,
}: SummaryProps) => {
  const user = useSelector(getUser);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    if (!delivery) {
      message.warning(t('cart.cantCalculateShipping'));
    }
  }, [delivery]);

  const prices = sdk.utils.pricing.calculatePrices(items, delivery, campaigns);

  const handleCheckout = () => {
    if (!user) {
      dispatch(toggleAuthModal(true));
    } else {
      onCheckout();
    }
  };

  return (
    <>
      <Flex flexDirection='row' justifyContent='space-between'>
        <Text strong>{t('finance.subtotal')}</Text>
        <Text strong>{prices.productsTotal} ден</Text>
      </Flex>
      {prices.withCampaignsTotal !== prices.productsTotal && (
        <Flex mt={2} flexDirection='row' justifyContent='space-between'>
          <Text strong>{t('finance.campaignDiscount')}</Text>
          <Text strong type='danger'>
            {prices.withCampaignsTotal - prices.productsTotal} ден
          </Text>
        </Flex>
      )}
      <Flex mt={2} flexDirection='row' justifyContent='space-between'>
        <Text strong>{t('finance.shippingCost')}</Text>
        <Text strong>{prices.deliveryTotal} ден</Text>
      </Flex>
      <Divider />
      <Flex flexDirection='row' justifyContent='space-between'>
        <Text strong>{t('finance.total')}</Text>
        <Text strong>{prices.total} ден</Text>
      </Flex>

      {onCheckout && (
        <Flex justifyContent='center' alignItems='center'>
          <Button
            disabled={disabled}
            onClick={handleCheckout}
            width='100%'
            size='large'
            mt={4}
            type={'primary'}
          >
            {buttonTitle}
          </Button>
        </Flex>
      )}
    </>
  );
};
