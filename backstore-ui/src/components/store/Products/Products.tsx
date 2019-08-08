import React, { useEffect } from 'react';
import { FlexGrid } from 'blocks-ui/dist/basic/FlexGrid';
import { ProductCard } from '../shared/ProductCard';
import { useSelector, useDispatch } from 'react-redux';
import { getProducts } from '../../../state/modules/products/products.selector';
import { Product } from 'la-sdk/dist/models/product';
import { sdk } from 'la-sdk';
import { getStore } from '../../../state/modules/store/store.selector';
import { Store } from 'la-sdk/dist/models/store';
import { setProducts } from '../../../state/modules/products/products.module';
import { message } from 'blocks-ui/dist/static/message';
import { Title } from 'blocks-ui/dist/basic/Typography';
import { Flex } from 'blocks-ui/dist/basic/Flex';

export const Products = () => {
  const store: Store = useSelector(getStore);
  const products: Product[] = useSelector(getProducts);
  const dispatch = useDispatch();

  useEffect(() => {
    sdk.product
      .findForStore(store._id)
      .then(products => dispatch(setProducts(products.data)))
      .catch(err => message.error(err.message));
  }, [store, dispatch]);

  return (
    <Flex flexDirection='column' alignItems='center'>
      <Title mb={5} level={1}>
        All Products
      </Title>
      <FlexGrid
        rowKey='_id'
        totalItems={products.length}
        dataSource={products}
        renderItem={(item: any) => <ProductCard product={item} />}
      />
    </Flex>
  );
};
