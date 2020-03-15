import React, { useState, useEffect } from 'react';
import {
  Flex,
  Title,
  Card,
  Row,
  Col,
  Button,
  Empty,
  Spin,
  hooks,
} from '@sradevski/blocks-ui';
import { Summary } from '../shared/Summary';
import { getCartWithProducts } from '../../state/modules/cart/cart.selector';
import { getDelivery } from '../../state/modules/delivery/delivery.selector';
import { useSelector, useDispatch } from 'react-redux';
import { getStore } from '../../state/modules/store/store.selector';
import { sdk } from '@sradevski/la-sdk';
import { getUser, getAddresses } from '../../state/modules/user/user.selector';
import { Order } from '@sradevski/la-sdk/dist/models/order';
import {
  removeItemsFromCart,
  setCartWithProducts,
} from '../../state/modules/cart/cart.module';
import { Success } from './Success';
import { Address } from '@sradevski/la-sdk/dist/models/address/address';
import { ShippingDescription } from '../shared/ShippingDescription';
import { AddressesModal } from '../account/AddressesModal';
import { Page } from '../shared/Page';
import { CartWithProducts } from '@sradevski/la-sdk/dist/models/cart';
import { setAddresses } from '../../state/modules/user/user.module';
import { FindResult } from '@sradevski/la-sdk/dist/setup';
import { useTranslation } from '../../common/i18n';
import { getCampaigns } from '../../state/modules/campaigns/campaigns.selector';
import { setCampaigns } from '../../state/modules/campaigns/campaigns.module';

export const Checkout = () => {
  const [caller, showSpinner] = hooks.useCall();
  const cart = useSelector(getCartWithProducts);
  const delivery = useSelector(getDelivery);
  const campaigns = useSelector(getCampaigns);
  const store = useSelector(getStore);
  const user = useSelector(getUser);
  const addresses: Address[] = useSelector(getAddresses);
  const dispatch = useDispatch();

  const [order, setOrder] = useState(null);
  const [deliverTo, setDeliverTo] = useState(null);
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (!user || cart) {
      return;
    }

    caller(
      sdk.cart.getCartWithProductsForUser(user._id, store._id),
      (cartWithProducts: CartWithProducts) => {
        if (cartWithProducts) {
          return setCartWithProducts(cartWithProducts);
        }
      },
    );
  }, [caller, user, cart]);

  useEffect(() => {
    if (!user || addresses) {
      return;
    }

    caller(
      sdk.address.findForUser(user._id),
      (addresses: FindResult<Address>) => setAddresses(addresses.data),
    );
  }, [caller, user, addresses]);

  useEffect(() => {
    caller(sdk.campaign.findActiveForStore(store._id), fetchedCampaigns => {
      return setCampaigns(fetchedCampaigns.data);
    });
  }, [caller, store._id]);

  useEffect(() => {
    if (!deliverTo && addresses && addresses.length > 0) {
      setDeliverTo(addresses[0]);
    }
  }, [addresses, deliverTo]);

  if (order) {
    return <Success order={order} />;
  }

  if (!cart || !cart.items || cart.items.length <= 0) {
    return <Empty mt={6} description={t('cart.emptyCartDescription')}></Empty>;
  }

  const handleOrder = () => {
    const ordered = cart.items
      .filter(item => item.fromStore === store._id)
      .map(item => ({
        // Groups are required, but we don't pass them to the store as it can be sensitive info.
        product: { ...item.product, groups: [] },
        quantity: item.quantity,
      }));

    caller(
      sdk.order.create({
        orderedFrom: store._id,
        orderedBy: user._id,
        status: sdk.order.OrderStatus.PENDING,
        campaigns: sdk.utils.pricing
          .getApplicableCampaigns(campaigns, ordered)
          .map(campaign => ({ ...campaign, isActive: true })),
        delivery,
        deliverTo,
        ordered,
        // This is just to make the typings happy, as it will be calculated server-side.
        calculatedTotal: 0,
      }),
      (order: Order) => {
        setOrder(order);
        dispatch(removeItemsFromCart());
        sdk.cart.patch(user._id, { items: [] });
      },
    );
  };

  return (
    <Page title={t('pages.checkout')}>
      <Spin spinning={showSpinner}>
        <Flex
          width='100%'
          justifyContent='space-between'
          flexDirection={['column', 'row', 'row']}
        >
          <Flex flex={1} flexDirection='column' mr={[0, 3, 3]}>
            <Title level={3}>{t('address.chooseShippingAddress')}</Title>
            <Row
              type='flex'
              align='top'
              justify='start'
              gutter={{ xs: 16, sm: 24, md: 32, lg: 64 }}
            >
              {addresses &&
                addresses.map(address => {
                  return (
                    <Col key={address._id} mb={4}>
                      <Card
                        style={
                          deliverTo && deliverTo._id === address._id
                            ? {
                                border: '2px solid #1890ff',
                              }
                            : {}
                        }
                        hoverable={true}
                        onClick={() => setDeliverTo(address)}
                        width={320}
                        title={address.name}
                      >
                        <ShippingDescription address={address} />
                      </Card>
                    </Col>
                  );
                })}
              <Col key={'new'} mb={4}>
                <Button
                  size='large'
                  onClick={() => setAddressModalVisible(true)}
                >
                  {t('address.addNewAddress')}
                </Button>
              </Col>
            </Row>
          </Flex>
          <Flex maxWidth={[0, 500, 500]} flex={1} ml={[0, 3, 3]} my={[4, 0, 0]}>
            <Card title={t('common.summary')} px={3} width='100%'>
              <Summary
                items={cart.items}
                delivery={delivery}
                campaigns={campaigns ?? []}
                disabled={!deliverTo}
                buttonTitle={t('actions.orderNow')}
                onCheckout={handleOrder}
              />
            </Card>
          </Flex>
        </Flex>
        <AddressesModal
          user={user}
          visible={addressModalVisible}
          onClose={() => setAddressModalVisible(false)}
        />
      </Spin>
    </Page>
  );
};
