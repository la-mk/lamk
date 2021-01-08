import React, { useEffect } from 'react';
import { Flex, Text, Divider, Button, toast, Box } from '@la-mk/blocks-ui';
import { CartItemWithProduct } from '@la-mk/la-sdk/dist/models/cart';
import { Delivery } from '@la-mk/la-sdk/dist/models/delivery';
import { useSelector, useDispatch } from 'react-redux';
import { getUser } from '../../state/modules/user/user.selector';
import { toggleAuthModal } from '../../state/modules/ui/ui.module';
import { OrderItem } from '@la-mk/la-sdk/dist/models/order';
import { useTranslation } from '../../common/i18n';
import { sdk } from '@la-mk/la-sdk';
import { Campaign } from '@la-mk/la-sdk/dist/models/campaign';
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
  title?: string;
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
      minWidth={['18rem', '22rem', '22rem']}
      width='100%'
      title={t('common.summary')}
      {...props}
    >
      {showProductsSummary && (
        <>
          <SummaryProductList items={items} storeId={storeId} />
          <Divider my={4} />
        </>
      )}

      <Flex justify='space-between'>
        <Text>{t('finance.subtotal')}</Text>
        <Text as='strong'>{prices.productsTotal} ден</Text>
      </Flex>

      {prices.withCampaignsTotal !== prices.productsTotal && (
        <Flex mt={4} direction='row' justify='space-between'>
          <Text>{t('finance.campaignDiscount')}</Text>
          <Text as='strong' color='danger'>
            {(prices.withCampaignsTotal - prices.productsTotal).toFixed(1)} ден
          </Text>
        </Flex>
      )}

      <Flex mt={4} direction='row' justify='space-between'>
        <Text>{t('finance.shippingCost')}</Text>
        <Text as='strong'>{prices.deliveryTotal} ден</Text>
      </Flex>
      {prices.deliveryTotal !== 0 && !hideFreeShipping && (
        <Box mt={2}>
          <Text size='sm' color='mutedText.dark'>
            {t('delivery.addToGetFreeDelivery', {
              priceUntilFreeDelivery: `${
                delivery.freeDeliveryOver - prices.withCampaignsTotal
              } ден`,
            })}
          </Text>
        </Box>
      )}

      <Divider my={4} />
      <Flex direction='row' justify='space-between'>
        <Text>{t('finance.total')}</Text>
        <Text as='strong' size='xl'>
          {prices.total} ден
        </Text>
      </Flex>

      {onCheckout && (
        <Button
          isDisabled={disabled}
          onClick={handleCheckout}
          isFullWidth
          size='lg'
          mt={6}
        >
          {buttonTitle}
        </Button>
      )}
      {showContinueShopping && (
        <Link href='/products' passHref>
          <Button as='a' variant='outline' isFullWidth size='lg' mt={4}>
            {t('product.seeOtherProducts')}
          </Button>
        </Link>
      )}
    </CustomCard>
  );
};
