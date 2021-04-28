import React from 'react';
import { Flex, Box, Heading, Text, Button } from '@la-mk/blocks-ui';
import { sdk } from '@la-mk/la-sdk';
import { useTranslation } from '../../../common/i18n';
import Link from 'next/link';
import { Eye } from 'react-feather';
import { OrderProductsList } from '../../shared/product/OrderProductsList';
import { formatDistanceToNow } from 'date-fns';
import { mk, enUS } from 'date-fns/locale';
import { Order } from '@la-mk/la-sdk/dist/models/order';
import { Store } from '@la-mk/la-sdk/dist/models/store';

export const OrderDescription = ({
  order,
  store,
  hideDetailsButton,
}: {
  order: Order;
  store: Store;
  hideDetailsButton?: boolean;
}) => {
  const { t, i18n } = useTranslation();

  return (
    <>
      <Flex
        mx={[2, 2, 6]}
        mt={4}
        mb={6}
        direction='row'
        align='center'
        justify='space-between'
      >
        <Flex align='center' justify='center'>
          <Box display={['none', 'none', 'initial']}>
            <Heading m={0} mr={4} as='h2' size='md'>
              {`${t('pages.order')} - ${sdk.utils.getShortId(order._id)}`}
            </Heading>
          </Box>
          {/* TODO: Standardize this and add to blocks-ui */}
          <svg width='6' height='6' viewBox='0 0 6 6' fill='none'>
            <circle
              cx='3'
              cy='3'
              r='3'
              fill={sdk.order.orderStatusColor[order.status]}
            />
          </svg>
          <Text
            color={sdk.order.orderStatusColor[order.status]}
            ml={1}
            size='sm'
          >
            {t(`orderStatus.${order.status}`)}
          </Text>
        </Flex>
        {!hideDetailsButton && (
          <Link
            passHref
            href='/account/orders/[pid]'
            as={`/account/orders/${order._id}`}
          >
            <Button as='a' variant='link' leftIcon={<Eye size='1.2rem' />}>
              {t('common.details')}
            </Button>
          </Link>
        )}
      </Flex>

      <OrderProductsList
        items={order.ordered}
        currency={order.currency}
        store={store}
      />

      <Flex mt={2} px={[1, 1, 2]} justify='space-between' align='center'>
        <Text mr={2} size='sm' color='mutedText.dark'>
          {/* TODO: Show expected delivery */}
          {/* Expected delivery between 1 and 2 */}
        </Text>
        <Text ml={2} size='sm' color='mutedText.dark'>
          {t('order.ordered')}{' '}
          {formatDistanceToNow(new Date(order.createdAt), {
            // TODO: Handle locales better
            locale: i18n.language === 'mk' ? mk : enUS,
            addSuffix: true,
          })}
        </Text>
      </Flex>
    </>
  );
};
