import React, { useState, useEffect } from 'react';
import {
  Flex,
  Image,
  Text,
  Title,
  Button,
  InputNumber,
  Box,
  message,
  Spin,
  hooks,
  utils,
} from '@sradevski/blocks-ui';
import { Product as ProductType } from '@sradevski/la-sdk/dist/models/product';
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
import { useTranslation } from '../../common/i18n';
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

  const [trackedEvent, setTrackedEvent] = useState(false);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const outOfStock = product.stock === 0;

  const [selectedImage, setSelectedImage] = useState(
    sdk.artifact.getUrlForArtifact(product.images[0], store._id),
  );

  const [quantity, setQuantity] = React.useState(1);
  const isProductInCart =
    cart &&
    cart.items &&
    cart.items.some(item => item.product._id === product._id);

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

  useEffect(() => {
    setSelectedImage(
      sdk.artifact.getUrlForArtifact(product.images[0], store._id),
    );
  }, [product]);

  const handleAddToCart = () => {
    let action: Promise<Cart | void> = Promise.resolve();

    if (user) {
      action = sdk.cart.addItemToCart(user._id, {
        product: product._id,
        fromStore: store._id,
        quantity,
      });
    }

    dispatch(
      trackEvent({
        eventName: AnalyticsEvents.addItemToCart,
        productId: product._id,
        category: product.category,
        price: product.calculatedPrice,
        discount: product.discount,
        quantity,
      }),
    );

    caller(action, () => {
      message.info(t('cart.addedToCart'));
      return addCartItemWithProduct({
        product,
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
            <Box height={280} minWidth={180} style={{ position: 'relative' }}>
              <Image alt={product.name} height='100%' src={selectedImage} />
              <ProductTags product={product} t={t} />
            </Box>
            <Box mt={3} maxWidth={['100%', '100%', '80%']}>
              <Thumbnails
                images={product.images.map(imageId =>
                  sdk.artifact.getUrlForArtifact(imageId, store._id),
                )}
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
            <Title
              textAlign='center'
              level={1}
              fontSize={4}
              ellipsis={{ rows: 2 }}
            >
              {product.name}
            </Title>
            <Price
              size='large'
              calculatedPrice={product.calculatedPrice}
              basePrice={product.price}
              currency={'ден'}
            />
            <Flex alignItems='center' justifyContent='center' mt={[2, 3, 3]}>
              <Text>{t('product.availability')}:</Text>
              <Text ml={2} color={outOfStock ? 'danger' : 'success'}>
                {outOfStock ? t('product.outOfStock') : t('product.inStock')}
              </Text>
            </Flex>

            <Flex mt={[3, 4, 4]} flexDirection='row' alignItems='center'>
              {!isProductInCart && (
                <>
                  <InputNumber
                    disabled={outOfStock}
                    width='68px'
                    size='large'
                    min={1}
                    max={product.stock || 999}
                    value={quantity}
                    onChange={(val: number) => setQuantity(val)}
                    mr={2}
                  />
                </>
              )}
              {isProductInCart ? (
                <>
                  <Text color='mutedText.dark'>
                    {t('cart.productAlreadyInCart')}
                  </Text>
                  <Link passHref href='/cart'>
                    <Button type='primary' size='large' ml={2}>
                      {t('actions.goToCart')}
                    </Button>
                  </Link>
                </>
              ) : (
                <Button
                  disabled={outOfStock}
                  onClick={handleAddToCart}
                  ml={2}
                  width={200}
                  size='large'
                  type='primary'
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
            name: 'category',
            value: product.category,
          },
          { name: 'discounted' },
        ]}
      />

      <Box mt={[6, 7, 7]}>
        <ServicesSet />
      </Box>
    </Page>
  );
};
