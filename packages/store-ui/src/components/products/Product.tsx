import React, { useState, useEffect } from 'react';
import queryString from 'qs';
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
  Paragraph,
  hooks,
  utils,
} from '@sradevski/blocks-ui';
import {
  Product as ProductType,
  ProductSet as ProductSetType,
} from '@sradevski/la-sdk/dist/models/product';
import { sdk } from '@sradevski/la-sdk';
import { Price } from '../shared/Price';
import { ProductSet } from '../sets/ProductSet';
import { Thumbnails } from '../shared/Thumbnails';
import { useSelector, useDispatch } from 'react-redux';
import { Cart } from '@sradevski/la-sdk/dist/models/cart';
import Link from 'next/link';
import { addCartItemWithProduct } from '../../state/modules/cart/cart.module';
import { getCartWithProducts } from '../../state/modules/cart/cart.selector';
import { getStore } from '../../state/modules/store/store.selector';
import { getUser } from '../../state/modules/user/user.selector';
import { Page } from '../shared/Page';
import { useTranslation, getTranslationBaseForSet } from '../../common/i18n';
import { getFiltersFromSetQuery } from '../../common/filterUtils';
import { trackEvent } from '../../state/modules/analytics/analytics.actions';
import { session, AnalyticsEvents } from '@sradevski/analytics';

interface ProductProps {
  product: ProductType;
}

export const Product = ({ product }: ProductProps) => {
  const [caller, showSpinner] = hooks.useCall();
  const cart = useSelector(getCartWithProducts);
  const store = useSelector(getStore);
  const user = useSelector(getUser);
  const [trackedEvent, setTrackedEvent] = useState(false);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const outOfStock = product.stock === 0;

  const [productSets, setProductSets] = useState<ProductSetType[]>([]);
  const [selectedImage, setSelectedImage] = useState(
    sdk.artifact.getUrlForArtifact(product.images[0], store._id),
  );

  const [quantity, setQuantity] = React.useState(1);
  const isProductInCart =
    cart &&
    cart.items &&
    cart.items.some(item => item.product._id === product._id);

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
    if (!store) {
      return;
    }

    caller(
      sdk.product.getProductSetsForStore(store._id, [{ name: 'latest' }]),
      setProductSets,
    );
  }, [store]);

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
            <Image alt={product.name} maxHeight='280px' src={selectedImage} />
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
              style={{ textAlign: 'center' }}
              level={2}
              ellipsis={{ rows: 2 }}
            >
              {product.name}
            </Title>
            <Price
              calculatedPrice={product.calculatedPrice}
              basePrice={product.price}
              currency={'ден'}
            />
            <Paragraph style={{ whiteSpace: 'pre-wrap' }} mt={4}>
              {product.description}
            </Paragraph>
            <Box mt={[3, 4, 4]}>
              {outOfStock && (
                <Text color='danger'>{t('product.outOfStockLong')}</Text>
              )}

              <Flex mt={[2, 3, 3]} flexDirection='row' alignItems='center'>
                {!isProductInCart && (
                  <>
                    <InputNumber
                      disabled={outOfStock}
                      width='68px'
                      size='large'
                      min={1}
                      max={product.stock || 999}
                      value={quantity}
                      onChange={setQuantity}
                      mr={2}
                    />
                  </>
                )}
                {isProductInCart ? (
                  <>
                    <Text type='secondary'>
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
                    size='large'
                    type='primary'
                  >
                    {t('actions.addToCart')}
                  </Button>
                )}
              </Flex>
            </Box>
          </Flex>
        </Flex>
        <Box mt={6}>
          {productSets
            .filter(set => Boolean(set.data))
            .map(set => (
              <ProductSet
                storeId={store._id}
                allHref={`/products?${queryString.stringify(
                  getFiltersFromSetQuery(set.filter.query),
                )}`}
                key={set.setTag.name + (set.setTag.value || '')}
                products={set.data}
                title={t(getTranslationBaseForSet(set.setTag))}
                subtitle='The best products of the week'
              />
            ))}
        </Box>
      </Spin>
    </Page>
  );
};
