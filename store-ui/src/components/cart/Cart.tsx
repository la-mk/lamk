import React from 'react';
import {
  Flex,
  List,
  SizedImage,
  Text,
  Button,
  InputNumber,
  Title,
} from 'blocks-ui';
import { sdk } from 'la-sdk';
import { Summary } from './Summary';

export const Cart = ({ cartItems, delivery }: any) => {
  return (
    <Flex flexDirection='column' alignItems='center' mb={5}>
      <Title mb={5} level={1}>
        Your cart
      </Title>
      <Flex
        px={4}
        width='100%'
        flexDirection={['column', 'column', 'row', 'row']}
      >
        <Flex flex={2} mr={[0, 0, 3, 3]}>
          <List style={{ width: '100%' }}>
            {cartItems.map(cartItem => (
              <List.Item key={cartItem.product._id}>
                <Flex width={1}>
                  <Flex
                    width='180px'
                    justifyContent='center'
                    alignItems='center'
                  >
                    <SizedImage
                      height='90px'
                      width='100%'
                      alt={cartItem.product.name}
                      src={sdk.artifact.getUrlForArtifact(
                        cartItem.product.images[0],
                      )}
                    />
                  </Flex>
                  <Flex ml={4} width='100%' flexDirection='row'>
                    <Flex
                      flex={1}
                      flexDirection='column'
                      justifyContent='space-between'
                      alignItems='flex-start'
                    >
                      <Text strong>{cartItem.product.name}</Text>
                      <Button pl={0} type='link'>
                        Remove
                      </Button>
                    </Flex>
                    <Flex
                      flex={1}
                      flexDirection='row'
                      justifyContent='space-between'
                      alignItems='center'
                    >
                      <Text>{cartItem.product.price} ден</Text>
                      <InputNumber
                        width='80px'
                        size='default'
                        min={1}
                        max={999}
                        value={cartItem.quantity}
                        onChange={() => null}
                        mx={2}
                      />
                      <Text strong>
                        {cartItem.quantity * cartItem.product.price} ден
                      </Text>
                    </Flex>
                  </Flex>
                </Flex>
              </List.Item>
            ))}
          </List>
        </Flex>
        <Flex flex={1} ml={[0, 0, 3, 3]}>
          <Summary cartItems={cartItems} delivery={delivery} />
        </Flex>
      </Flex>
    </Flex>
  );
};
