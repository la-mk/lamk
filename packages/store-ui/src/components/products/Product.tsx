import React, { useState, useEffect } from 'react';
import {
  Flex,
  SizedImage,
  Text,
  Title,
  Button,
  InputNumber,
  Box,
  message,
  Spin,
} from '@lamk/blocks-ui';
import { Product as ProductType } from '@lamk/la-sdk/dist/models/product';
import { sdk } from '@lamk/la-sdk';
import { Price } from '../shared/Price';
import { ProductSet } from '../sets/ProductSet';
import { Thumbnails } from '../shared/Thumbnails';
import { useSelector } from 'react-redux';
import { Cart } from '@lamk/la-sdk/dist/models/cart';
import Link from 'next/link';
import { addCartItemWithProduct } from '../../state/modules/cart/cart.module';
import { getCartWithProducts } from '../../state/modules/cart/cart.selector';
import { getStore } from '../../state/modules/store/store.selector';
import { getUser } from '../../state/modules/user/user.selector';
import { Page } from '../shared/Page';
import { useCall } from '../shared/hooks/useCall';
import { FindResult } from '@lamk/la-sdk/dist/setup';
import { useTranslation } from '../../common/i18n';

interface ProductProps {
  product: ProductType;
}

export const Product = ({ product }: ProductProps) => {
  const [caller, showSpinner] = useCall();
  const cart = useSelector(getCartWithProducts);
  const store = useSelector(getStore);
  const user = useSelector(getUser);
  const { t } = useTranslation();

  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(
    sdk.artifact.getUrlForArtifact(product.images[0]),
  );
  const [quantity, setQuantity] = React.useState(1);
  const isProductInCart =
    cart &&
    cart.items &&
    cart.items.some(item => item.product._id === product._id);

  useEffect(() => {
    caller(
      sdk.product.findForStore(store._id),
      (products: FindResult<ProductType>) => setRelatedProducts(products.data),
    );
  }, [caller]);

  useEffect(() => {
    setSelectedImage(sdk.artifact.getUrlForArtifact(product.images[0]));
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
        <Flex flexDirection={['column', 'column', 'row', 'row']}>
          <Flex
            width={['100%', '100%', '50%', '50%']}
            alignItems='center'
            justifyContent='flex-start'
            flexDirection='column'
          >
            <SizedImage height='350px' src={selectedImage} />
            <Box mt={3} maxWidth={['100%', '80%', '100%', '80%']}>
              <Thumbnails
                images={product.images.map(imageId =>
                  sdk.artifact.getUrlForArtifact(imageId),
                )}
                selectedImage={selectedImage}
                onImageClick={setSelectedImage}
              />
            </Box>
          </Flex>
          <Flex
            width={['100%', '100%', '50%', '50%']}
            alignItems={['center', 'center', 'flex-start', 'flex-start']}
            justifyContent='flex-start'
            flexDirection='column'
          >
            <Title level={2} ellipsis>
              {product.name}
            </Title>
            <Price price={product.price} currency={'ден'} />
            <Text mt={4}>{product.description}</Text>
            <Flex mt={[4, 4, 5, 5]} flexDirection='row' alignItems='center'>
              {!isProductInCart && (
                <>
                  <Text>{t('common.quantity')}</Text>
                  <InputNumber
                    width='80px'
                    size='large'
                    min={1}
                    max={999}
                    value={quantity}
                    onChange={setQuantity}
                    mx={2}
                  />
                </>
              )}
              {isProductInCart ? (
                <>
                  <Text type='secondary'>{t('cart.productAlreadyInCart')}</Text>
                  <Link passHref href='/cart'>
                    <Button type='primary' size='large' ml={2}>
                      {t('actions.goToCart')}
                    </Button>
                  </Link>
                </>
              ) : (
                <Button
                  onClick={handleAddToCart}
                  ml={2}
                  size='large'
                  type='primary'
                >
                  {t('actions.addToCart')}
                </Button>
              )}
            </Flex>
          </Flex>
        </Flex>
        <Flex mt={5}>
          <ProductSet
            title={t('product.relatedProducts')}
            products={relatedProducts}
          />
        </Flex>
      </Spin>
    </Page>
  );
};
