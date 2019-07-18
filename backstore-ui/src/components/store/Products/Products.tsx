import React, { useEffect } from 'react';
import { List } from '../../../component-lib/basic/List';
import { ProductCard } from './ProductCard';
import { useSelector, useDispatch } from 'react-redux';
import { getProducts } from '../../../state/modules/products/products.selector';
import { Product } from '../../../sdk/models/product';
import { sdk } from '../../../sdk';
import { getStore } from '../../../state/modules/store/store.selector';
import { Store } from '../../../sdk/models/store';
import { setProducts } from '../../../state/modules/products/products.module';
import { message } from '../../../component-lib/static/message';
import { Title } from '../../../component-lib/basic/Typography';
import { Flex } from '../../../component-lib/basic/Flex';

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
      <List
        rowKey='_id'
        totalItems={products.length}
        dataSource={products}
        renderItem={(item: any) => <ProductCard product={item} />}
      />
    </Flex>
  );
};
