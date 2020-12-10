import React, { useEffect } from 'react';
import { Flex, Text, Divider, Button, toast, Box } from '@sradevski/blocks-ui';
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
      toast.warning(t('cart.cantCalculateShipping'));
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
          <Divider my={3} />
        </>
      )}
      <Flex direction='row' justify='space-between'>
        <Text>{t('finance.subtotal')}</Text>
        <Text as='strong'>{prices.productsTotal} ден</Text>
      </Flex>
      {prices.withCampaignsTotal !== prices.productsTotal && (
        <Flex mt={3} direction='row' justify='space-between'>
          <Text>{t('finance.campaignDiscount')}</Text>
          <Text as='strong' color='danger'>
            {(prices.withCampaignsTotal - prices.productsTotal).toFixed(1)} ден
          </Text>
        </Flex>
      )}
      <Flex mt={3} direction='row' justify='space-between'>
        <Text>{t('finance.shippingCost')}</Text>
        <Text as='strong'>{prices.deliveryTotal} ден</Text>
      </Flex>
      {prices.deliveryTotal !== 0 && !hideFreeShipping && (
        <Box mt={3}>
          <Text size='sm' color='mutedText.dark'>
            {t('delivery.addToGetFreeDelivery', {
              priceUntilFreeDelivery: `${
                delivery.freeDeliveryOver - prices.withCampaignsTotal
              } ден`,
            })}
          </Text>
        </Box>
      )}
      <Divider my={3} />
      <Flex direction='row' justify='space-between'>
        <Text>{t('finance.total')}</Text>
        <Text as='strong' color='primary' size='sm'>
          {prices.total} ден
        </Text>
      </Flex>

      {onCheckout && (
        <Button
          isDisabled={disabled}
          onClick={handleCheckout}
          isFullWidth
          size='lg'
          mt={4}
        >
          {buttonTitle}
        </Button>
      )}
      {showContinueShopping && (
        <Link href='/products' passHref>
          <Button as='a' variant='ghost' isFullWidth size='lg' mt={3}>
            {t('product.seeOtherProducts')}
          </Button>
        </Link>
      )}
    </CustomCard>
  );
};
