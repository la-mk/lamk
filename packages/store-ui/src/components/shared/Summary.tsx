import React, { useEffect } from 'react';
import {
  Flex,
  Label,
  Divider,
  Button,
  message,
  Box,
  Paragraph,
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
import Link from 'next/link';

interface SummaryProps {
  items: (CartItemWithProduct | OrderItem)[];
  delivery: Delivery;
  campaigns: Campaign[];
  storeId?: string;
  buttonTitle?: string;
  disabled?: boolean;
  showProductsSummary?: boolean;
  onCheckout?: () => void;
  showContinueShopping?: boolean;
  hideFreeShipping?: boolean;
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
  showContinueShopping,
  hideFreeShipping,
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
          <Divider height={'2px'} bg='mutedText.light' />
        </>
      )}
      <Flex flexDirection='row' justifyContent='space-between'>
        <Label size='small' color='contentSecondary'>
          {t('finance.subtotal')}
        </Label>
        <Label color='contentSecondary'>{prices.productsTotal} ден</Label>
      </Flex>
      {prices.withCampaignsTotal !== prices.productsTotal && (
        <Flex mt={3} flexDirection='row' justifyContent='space-between'>
          <Label size='small' color='contentSecondary'>
            {t('finance.campaignDiscount')}
          </Label>
          <Label color='negative'>
            {(prices.withCampaignsTotal - prices.productsTotal).toFixed(1)} ден
          </Label>
        </Flex>
      )}
      <Flex mt={3} flexDirection='row' justifyContent='space-between'>
        <Label size='small' color='contentSecondary'>
          {t('finance.shippingCost')}
        </Label>
        <Label color='contentSecondary'>{prices.deliveryTotal} ден</Label>
      </Flex>
      {prices.deliveryTotal !== 0 && !hideFreeShipping && (
        <Box mt={3}>
          <Paragraph size='small' color='contentTertiary'>
            {t('delivery.addToGetFreeDelivery', {
              priceUntilFreeDelivery: `${
                delivery.freeDeliveryOver - prices.withCampaignsTotal
              } ден`,
            })}
          </Paragraph>
        </Box>
      )}
      <Divider height={'2px'} bg='mutedText.light' />
      <Flex flexDirection='row' justifyContent='space-between'>
        <Label size='small' color='contentSecondary'>
          {t('finance.total')}
        </Label>
        <Label
          color='primary'
          size={['small', 'medium', 'medium']}
          $style={{ fontWeight: 500 }}
        >
          {prices.total} ден
        </Label>
      </Flex>

      {onCheckout && (
        <Button
          disabled={disabled}
          onClick={handleCheckout}
          width='100%'
          mt={4}
        >
          {buttonTitle}
        </Button>
      )}
      {showContinueShopping && (
        <Button kind='secondary' width='100%' mt={3}>
          <Link href='/products'>{t('product.seeOtherProducts')}</Link>
        </Button>
      )}
    </CustomCard>
  );
};
