import difference from 'lodash/difference';
import uniq from 'lodash/uniq';
import React, { useState, useEffect } from 'react';
import {
  Flex,
  Paragraph,
  Heading,
  Button,
  InputNumber,
  Box,
  Image,
  ImageMagnifier,
  message,
  Spin,
  PickerBoxes,
  hooks,
  utils,
  Label,
} from '@sradevski/blocks-ui';
import {
  Product as ProductType,
  Attributes,
} from '@sradevski/la-sdk/dist/models/product';
import { sdk } from '@sradevski/la-sdk';
import { Price } from '../shared/product/Price';
import { Thumbnails } from '../shared/Thumbnails';
import { useSelector, useDispatch } from 'react-redux';
import { Cart } from '@sradevski/la-sdk/dist/models/cart';
import Link from 'next/link';
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
import { trackEvent } from '../../state/modules/analytics/analytics.actions';
import { session, AnalyticsEvents } from '@sradevski/analytics';
import { useBreadcrumb } from '../shared/hooks/useBreadcrumb';
import { ProductDetails } from './ProductDetails';
import { ProductTags } from '../shared/product/ProductTags';
import { ManagedSets } from '../sets/ManagedSets';
import { getDelivery } from '../../state/modules/delivery/delivery.selector';
import { setDelivery } from '../../state/modules/delivery/delivery.module';
import { ServicesSet } from '../sets/ServicesSet';

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

  const [selectedImage, setSelectedImage] = useState(product.images[0]);

  const [quantity, setQuantity] = React.useState(1);
  const selectedVariant = sdk.product.getVariantForAttributes(
    product,
    chosenAttributes,
  );

  const isProductInCart =
    cart &&
    cart.items &&
    cart.items.some(
      item =>
        item.product._id === product._id &&
        sdk.product.areAttributesEquivalent(
          item.product?.attributes,
          selectedVariant?.attributes,
        ),
    );

  const allColors = uniq(
    product.variants.map(variant => variant.attributes?.color).filter(x => !!x),
  );

  const allSizes = uniq(
    product.variants.map(variant => variant.attributes?.size).filter(x => !!x),
  );

  const variantsWithStock = product.variants.filter(
    variant => variant.stock == null || variant.stock > 0,
  );

  const remainingColorChoices = chosenAttributes?.size
    ? variantsWithStock
        .filter(variant => variant.attributes?.size === chosenAttributes.size)
        .map(variant => variant.attributes?.color)
        .filter(x => !!x)
    : variantsWithStock
        .map(variant => variant.attributes?.color)
        .filter(x => !!x);

  const remainingSizeChoices = chosenAttributes?.color
    ? variantsWithStock
        .filter(variant => variant.attributes?.color === chosenAttributes.color)
        .map(variant => variant.attributes?.size)
        .filter(x => !!x)
    : variantsWithStock
        .map(variant => variant.attributes?.size)
        .filter(x => !!x);

  const disabledSizeChoices = difference(allSizes, remainingSizeChoices);
  const disabledColorChoices = difference(allColors, remainingColorChoices);

  useBreadcrumb([
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
  ]);

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
    setSelectedImage(product.images[0]);
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
      message.info(t('cart.addedToCart'));
      return addCartItemWithProduct({
        product: orderProduct,
        quantity,
        fromStore: store._id,
      });
    });
  };

  return (
    <Page>
      <Spin spinning={showSpinner}>
        <Flex flexDirection={['column', 'row', 'row']}>
          <Flex
            width={['100%', '50%', '50%']}
            alignItems='center'
            justifyContent='flex-start'
            flexDirection='column'
          >
            <Box height={420} minWidth={180} style={{ position: 'relative' }}>
              <ImageMagnifier
                magnifierSize={180}
                zoomFactor={1.15}
                src={sdk.artifact.getUrlForImage(selectedImage, store._id)}
              >
                {imageProps => (
                  <Image
                    {...imageProps}
                    getSrc={params =>
                      sdk.artifact.getUrlForImage(
                        selectedImage,
                        store._id,
                        params,
                      )
                    }
                    height={420}
                    alt={product.name}
                  />
                )}
              </ImageMagnifier>
              <ProductTags product={product} t={t} />
            </Box>
            <Box mt={3} maxWidth={['100%', '100%', '80%']}>
              <Thumbnails
                images={product.images}
                imageBucket={store._id}
                selectedImage={selectedImage}
                onImageClick={setSelectedImage}
              />
            </Box>
          </Flex>
          <Flex
            width={['100%', '50%', '50%']}
            alignItems={['center', 'flex-start', 'flex-start']}
            justifyContent='flex-start'
            flexDirection='column'
          >
            <Heading
              as='h1'
              size='medium'
              textAlign='center'
              // ellipsis={{ rows: 2 }}
            >
              {product.name}
            </Heading>
            <Flex
              flexDirection='column'
              alignItems={['center', 'flex-start', 'flex-start']}
              justifyContent='center'
            >
              <Price
                size='large'
                minCalculatedPrice={
                  selectedVariant
                    ? selectedVariant.calculatedPrice
                    : product.minCalculatedPrice
                }
                maxCalculatedPrice={
                  selectedVariant
                    ? selectedVariant.calculatedPrice
                    : product.maxCalculatedPrice
                }
                minPrice={
                  selectedVariant ? selectedVariant.price : product.minPrice
                }
                maxPrice={
                  selectedVariant ? selectedVariant.price : product.maxPrice
                }
                currency={'ден'}
              />
              <Label mt={2} size='small' color='contentTertiary'>
                {t(`units.${product.unit}`)}
              </Label>
            </Flex>
            <Flex alignItems='center' justifyContent='center' mt={[3, 4, 4]}>
              <Label size='small' color='contentSecondary' mr={2}>
                {t('product.availability')}:
              </Label>
              <Label size='small' color={outOfStock ? 'negative' : 'positive'}>
                {outOfStock ? t('product.outOfStock') : t('product.inStock')}
              </Label>
            </Flex>
            <Box mt={[2, 3, 3]}>
              {allColors.length > 0 && (
                <Flex mt={2} alignItems='center' justifyContent='flex-start'>
                  <Label size='small' color='contentSecondary' mr={2}>
                    {t('attributes.color')}:
                  </Label>
                  <PickerBoxes
                    size='compact'
                    type='color'
                    disabled={disabledColorChoices}
                    values={allColors}
                    selected={chosenAttributes?.color}
                    onSelect={(color: string | undefined) =>
                      setChosenAttributes({
                        ...(chosenAttributes ?? {}),
                        color,
                      })
                    }
                  />
                </Flex>
              )}

              {allSizes.length > 0 && (
                <Flex alignItems='center' justifyContent='flex-start' mt={2}>
                  <Label size='small' color='contentSecondary' mr={2}>
                    {t('attributes.size')}:
                  </Label>
                  <PickerBoxes
                    size='compact'
                    disabled={disabledSizeChoices}
                    values={allSizes}
                    selected={chosenAttributes?.size}
                    onSelect={(size: string | undefined) =>
                      setChosenAttributes({ ...(chosenAttributes ?? {}), size })
                    }
                  />
                </Flex>
              )}
            </Box>

            <Flex mt={[3, 4, 4]} flexDirection='row' alignItems='center'>
              {!isProductInCart && (
                <>
                  <InputNumber
                    disabled={outOfStock || !selectedVariant}
                    width='68px'
                    size='large'
                    min={1}
                    max={selectedVariant?.stock || 999}
                    value={quantity}
                    onChange={(val: number) => setQuantity(val)}
                    mr={2}
                  />
                </>
              )}
              {isProductInCart ? (
                <>
                  <Paragraph mb={0} color='contentTertiary'>
                    {t('cart.productAlreadyInCart')}
                  </Paragraph>

                  <Button size='large' ml={2}>
                    <Link href='/cart'>{t('actions.goToCart')}</Link>
                  </Button>
                </>
              ) : (
                <Button
                  disabled={outOfStock || !selectedVariant}
                  onClick={handleAddToCart}
                  ml={2}
                  width={200}
                  size='large'
                >
                  {t('actions.addToCart')}
                </Button>
              )}
            </Flex>
            <Box mx={[3, 0, 0]} mt={4}>
              <ProductDetails product={product} delivery={delivery} />
            </Box>
          </Flex>
        </Flex>
      </Spin>

      <ManagedSets
        mt={[6, 7, 7]}
        storeId={store._id}
        setTags={[
          {
            title: t(
              getTitleForSet({ type: 'category', value: product.category }),
            ),
            subtitle: t(
              getSubtitleForSet({ type: 'category', value: product.category }),
            ),
            type: 'category',
            value: product.category,
            isPromoted: false,
          },
          {
            title: t(getTitleForSet({ type: 'discounted', value: undefined })),
            subtitle: t(
              getSubtitleForSet({ type: 'discounted', value: undefined }),
            ),
            type: 'discounted',
            value: undefined,
            isPromoted: false,
          },
        ]}
      />

      <Box mt={[6, 7, 7]}>
        <ServicesSet />
      </Box>
    </Page>
  );
};
