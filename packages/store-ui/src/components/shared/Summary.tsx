import React, { useEffect } from 'react';
import {
  Flex,
  Text,
  Divider,
  Button,
  message,
  Box,
} from '@sradevski/blocks-ui';
import { CartItemWithProduct } from '@sradevski/la-sdk/dist/models/cart';
import { Delivery } from '@sradevski/la-sdk/dist/models/delivery';
import { useSelector, useDispatch } from 'react-redux';
import { getUser } from '../../state/modules/user/user.selector';
import { toggleAuthModal } from '../../state/modules/ui/ui.module';
import { OrderItem } from '@sradevski/la-sdk/dist/models/order';
import { useTranslation } from '../../common/i18n';
import { sdk } from '@sradevski/la-sdk';
import { Campaign } from '@sradevski/la-sdk/dist/models/campaign';
import { CustomCard } from './components/CustomCard';
import { SummaryProductList } from './SummaryProductList';

interface SummaryProps {
  items: (CartItemWithProduct | OrderItem)[];
  delivery: Delivery;
  campaigns: Campaign[];
  storeId?: string;
  buttonTitle?: string;
  disabled?: boolean;
  showProductsSummary?: boolean;
  onCheckout?: () => void;
}

export const Summary = ({
  items,
  delivery,
  campaigns,
  storeId,
  buttonTitle,
  disabled,
  showProductsSummary,
  onCheckout,
  ...props
}: SummaryProps & React.ComponentProps<typeof Box>) => {
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
    <CustomCard
      height='fit-content'
      maxWidth={420}
      minWidth={320}
      title={t('common.summary')}
      width='100%'
      {...props}
    >
      {showProductsSummary && (
        <>
          <SummaryProductList items={items} storeId={storeId} />
          <Divider bg='mutedText.light' />
        </>
      )}
      <Flex flexDirection='row' justifyContent='space-between'>
        <Text>{t('finance.subtotal')}</Text>
        <Text strong>{prices.productsTotal} ден</Text>
      </Flex>
      {prices.withCampaignsTotal !== prices.productsTotal && (
        <Flex mt={3} flexDirection='row' justifyContent='space-between'>
          <Text>{t('finance.campaignDiscount')}</Text>
          <Text strong color='danger'>
            {(prices.withCampaignsTotal - prices.productsTotal).toFixed(1)} ден
          </Text>
        </Flex>
      )}
      <Flex mt={3} flexDirection='row' justifyContent='space-between'>
        <Text>{t('finance.shippingCost')}</Text>
        <Text strong>{prices.deliveryTotal} ден</Text>
      </Flex>
      {prices.deliveryTotal !== 0 && (
        <Box mt={3}>
          <Text fontSize={0} color='mutedText.dark'>
            Add {delivery.freeDeliveryOver - prices.withCampaignsTotal} ден more
            and get FREE SHIPPING!
          </Text>
        </Box>
      )}
      <Divider bg='mutedText.light' />
      <Flex flexDirection='row' justifyContent='space-between'>
        <Text>{t('finance.total')}</Text>
        <Text strong color='primary'>
          {prices.total} ден
        </Text>
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
    </CustomCard>
  );
};
