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
} from 'blocks-ui';
import { Product as ProductType } from 'la-sdk/dist/models/product';
import { sdk } from 'la-sdk';
import { Price } from '../shared/Price';
import { ProductSet } from '../sets/ProductSet';
import { Thumbnails } from '../shared/Thumbnails';
import { connect, useSelector } from 'react-redux';
import {
  CartWithProducts,
  CartItemWithProduct,
  Cart,
} from 'la-sdk/dist/models/cart';
import Link from 'next/link';
import { Store } from 'la-sdk/dist/models/store';
import { addCartItemWithProduct } from '../../state/modules/cart/cart.module';
import { getCartWithProducts } from '../../state/modules/cart/cart.selector';
import { getStore } from '../../state/modules/store/store.selector';
import { getUser } from '../../state/modules/user/user.selector';

interface ProductProps {
  store: Store;
  product: ProductType;
  cart: CartWithProducts;
  addProductToCart: (product: CartItemWithProduct) => void;
}

export const ProductBase = ({
  store,
  cart,
  product,
  addProductToCart,
}: ProductProps) => {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(
    sdk.artifact.getUrlForArtifact(product.images[0]),
  );
  const [quantity, setQuantity] = React.useState(1);
  const isProductInCart =
    cart &&
    cart.items &&
    cart.items.some(item => item.product._id === product._id);
  const user = useSelector(getUser);

  useEffect(() => {
    setSelectedImage(sdk.artifact.getUrlForArtifact(product.images[0]));
  }, [product]);

  useEffect(() => {
    sdk.product
      .findForStore(store._id)
      .then(products => setRelatedProducts(products.data))
      .catch(err => console.log(err));
  }, []);

  const handleAddToCart = () => {
    let action: Promise<Cart | void> = Promise.resolve();

    if (user) {
      action = sdk.cart.addItemToCart(user._id, {
        product: product._id,
        fromStore: store._id,
        quantity,
      });
    }

    action
      .then(() => addProductToCart({ product, quantity, fromStore: store._id }))
      .then(() => message.info('Added to cart'))
      .catch(err => message.error(err));
  };

  return (
    <>
      <Flex mx={[2, 2, 4, 4]} mt={4} flexDirection='column'>
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
                  <Text>Quantity:</Text>
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
                  <Text type='secondary'>Product already in cart</Text>
                  <Link passHref href='/cart'>
                    <Button type='primary' size='large' ml={2}>
                      Go to Cart
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
                  Add to Cart
                </Button>
              )}
            </Flex>
          </Flex>
        </Flex>
        <Flex mt={5}>
          <ProductSet title='Related Products' products={relatedProducts} />
        </Flex>
      </Flex>
    </>
  );
};

export const Product = connect(
  (state: any) => ({
    cart: getCartWithProducts(state),
    store: getStore(state),
  }),
  dispatch => ({
    addProductToCart: (cartItemWithProduct: CartItemWithProduct) =>
      dispatch(addCartItemWithProduct(cartItemWithProduct)),
  }),
)(ProductBase);
