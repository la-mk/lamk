import React, { useState, useEffect } from 'react';
import { Flex, Box, toast, Spinner, hooks, utils } from '@la-mk/blocks-ui';
import {
  Product as ProductType,
  Attributes,
} from '@la-mk/la-sdk/dist/models/product';
import { sdk } from '@la-mk/la-sdk';
import { useSelector, useDispatch } from 'react-redux';
import { Cart } from '@la-mk/la-sdk/dist/models/cart';
import { addCartItemWithProduct } from '../../state/modules/cart/cart.module';
import { getCartWithProducts } from '../../state/modules/cart/cart.selector';
import { getStore } from '../../state/modules/store/store.selector';
import { getPreviousPage } from '../../state/modules/ui/ui.selector';
import { getUser } from '../../state/modules/user/user.selector';
import { Page } from '../shared/Page';
import {
  getSubtitleForSet,
  getTitleForSet,
  useTranslation,
} from '../../common/i18n';
import { trackEvent } from '../../state/modules/analytics/analytics.module';
import { session, AnalyticsEvents } from '@la-mk/analytics';
import { useBreadcrumb } from '../shared/hooks/useBreadcrumb';
import { ProductDetails } from './ProductDetails';
import { ManagedSets } from '../sets/ManagedSets';
import { getDelivery } from '../../state/modules/delivery/delivery.selector';
import { setDelivery } from '../../state/modules/delivery/delivery.module';
import { ServicesSet } from '../sets/ServicesSet';
import { ProductImage } from './ProductImage';
import { ProductDescription } from './ProductDescription';
import { ProductOptions } from './ProductOptions';

interface ProductProps {
  product: ProductType;
}

const getProductsHref = (href: string) => {
  if (!href) {
    return '/products';
  }

  const url = new URL(href);

  if (
    url.pathname.startsWith('/products') &&
    url.pathname.split('/').length <= 2
  ) {
    return url.pathname + url.search;
  }

  return '/products';
};

export const Product = ({ product }: ProductProps) => {
  const [caller, showSpinner] = hooks.useCall();
  const cart = useSelector(getCartWithProducts);
  const store = useSelector(getStore);
  const user = useSelector(getUser);
  const delivery = useSelector(getDelivery);

  const previousPage = useSelector<string | undefined>(getPreviousPage);
  // If the product has at least one attribute, it means it has variants.
  const hasAttributes = sdk.product.hasVariants(product);
  const outOfStock = product.totalStock === 0;
  const hasSingleAvailableVariant =
    hasAttributes && !outOfStock && product.variants.length === 1;

  const [chosenAttributes, setChosenAttributes] = useState<
    Attributes | undefined
  >(undefined);

  const [trackedEvent, setTrackedEvent] = useState(false);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [quantity, setQuantity] = React.useState(1);
  const selectedVariant = sdk.product.getVariantForAttributes(
    product,
    chosenAttributes,
  );

  useBreadcrumb(
    [
      { url: '/', title: t('pages.home') },
      {
        url: getProductsHref(previousPage),
        title: t('pages.product_plural'),
      },
      {
        urlPattern: '/products/[pid]',
        url: `/products/${product._id}`,
        title: product.name.slice(0, 40),
      },
    ],
    [product?._id],
  );

  useEffect(() => {
    if (!delivery) {
      caller(sdk.delivery.findForStore(store._id), deliveries => {
        return setDelivery(deliveries.data[0] ?? null);
      });
    }
  }, [delivery, store._id]);

  useEffect(() => {
    if (!product?._id) {
      return;
    }

    setQuantity(1);
    setTrackedEvent(false);
    setChosenAttributes(
      hasSingleAvailableVariant
        ? product.variants[0].attributes
        : hasAttributes
        ? {}
        : undefined,
    );
  }, [product?._id]);

  useEffect(() => {
    if (!product || trackedEvent) {
      return;
    }

    const previousPage = session.getSessionInfo()?.previousPage;
    const filters = utils.filter.parseFiltersUrl(previousPage ?? '');
    const searchTerm = filters.searching ?? '';
    const filterings = Object.keys(filters.filtering ?? {});
    const onPage = filters.pagination?.currentPage;
    const pageSize = filters.pagination?.pageSize;

    dispatch(
      trackEvent({
        eventName: AnalyticsEvents.viewProduct,
        productId: product._id,
        category: product.category,
        searchTerm,
        filterings: filterings.length > 0 ? filterings : undefined,
        onPage,
        pageSize,
      }),
    );

    setTrackedEvent(true);
  }, [product, trackedEvent]);

  const handleAddToCart = () => {
    let action: Promise<Cart | void> = Promise.resolve();
    const orderProduct = sdk.product.convertToOrderProduct(
      product,
      chosenAttributes,
    );

    // The button should be disabled if there is there is no valid variant for the chosen attributes, this is just a safeguard.
    if (!orderProduct) {
      return;
    }

    const cartItem = {
      product: { id: orderProduct._id, attributes: chosenAttributes },
      fromStore: store._id,
      quantity,
    };

    if (user) {
      action = sdk.cart.addItemToCart(user._id, cartItem);
    }

    dispatch(
      trackEvent({
        eventName: AnalyticsEvents.addItemToCart,
        productId: orderProduct._id,
        attributes: JSON.stringify(chosenAttributes),
        category: orderProduct.category,
        price: orderProduct.calculatedPrice,
        discount: orderProduct.discount,
        quantity,
      }),
    );

    caller(action, () => {
      toast.info(t('cart.addedToCart'));
      return addCartItemWithProduct({
        product: orderProduct,
        quantity,
        fromStore: store._id,
      });
    });
  };

  return (
    <Page>
      <Spinner isLoaded={!showSpinner}>
        <Flex direction={['column', 'row', 'row']}>
          <ProductImage product={product} store={store} />
          <Flex
            ml={[0, 2, 2]}
            width={['100%', '50%', '50%']}
            align={['center', 'flex-start', 'flex-start']}
            justify='flex-start'
            direction='column'
          >
            <ProductDescription
              product={product}
              selectedVariant={selectedVariant}
              outOfStock={outOfStock}
            />

            <ProductOptions
              product={product}
              cart={cart}
              selectedVariant={selectedVariant}
              outOfStock={outOfStock}
              chosenAttributes={chosenAttributes}
              setChosenAttributes={setChosenAttributes}
              quantity={quantity}
              setQuantity={setQuantity}
              handleAddToCart={handleAddToCart}
            />
            <Box width='100%' mx={[4, 0, 0]} mt={[6, 7, 7]}>
              <ProductDetails product={product} delivery={delivery} />
            </Box>
          </Flex>
        </Flex>
      </Spinner>

      <ManagedSets
        mt={[8, 9, 9]}
        storeId={store._id}
        setTags={[
          {
            title: t(
              getTitleForSet({
                type: sdk.product.ProductSetType.CATEGORY,
                value: product.category,
              }),
            ),
            subtitle: t(
              getSubtitleForSet({
                type: sdk.product.ProductSetType.CATEGORY,
                value: product.category,
              }),
            ),
            type: sdk.product.ProductSetType.CATEGORY,
            value: product.category,
            isPromoted: false,
          },
          {
            title: t(
              getTitleForSet({
                type: sdk.product.ProductSetType.DISCOUNTED,
                value: undefined,
              }),
            ),
            subtitle: t(
              getSubtitleForSet({
                type: sdk.product.ProductSetType.DISCOUNTED,
                value: undefined,
              }),
            ),
            type: sdk.product.ProductSetType.DISCOUNTED,
            value: undefined,
            isPromoted: false,
          },
        ]}
      />

      <Box mt={[8, 9, 9]}>
        <ServicesSet />
      </Box>
    </Page>
  );
};
