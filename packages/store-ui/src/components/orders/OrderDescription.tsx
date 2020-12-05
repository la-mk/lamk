import React from 'react';
import { Flex, Box, Heading, Text, Button } from '@sradevski/blocks-ui';
import { sdk } from '@sradevski/la-sdk';
import { useTranslation } from '../../common/i18n';
import Link from 'next/link';
import { EyeFilled } from '@ant-design/icons';
import { OrderProductsList } from '../shared/product/OrderProductsList';
import { formatDistanceToNow } from 'date-fns';
import { mk, enUS } from 'date-fns/locale';
import { Order } from '@sradevski/la-sdk/dist/models/order';

export const OrderDescription = ({
  order,
  storeId,
  hideDetailsButton,
}: {
  order: Order;
  storeId: string;
  hideDetailsButton?: boolean;
}) => {
  const { t, i18n } = useTranslation();

  return (
    <>
      <Flex mb={3} direction='row' align='center' justify='space-between'>
        <Flex align='center' justify='center'>
          <Box display={['none', 'initial', 'initial']}>
            <Heading m={0} mr={3} as='h2' size='lg'>
              {`${t('pages.order')} - ${sdk.utils.getShortId(order._id)}`}
            </Heading>
          </Box>
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
          <Link passHref href='/orders/[pid]' as={`/orders/${order._id}`}>
            <Button as='a' variant='link' leftIcon={<EyeFilled />}>
              {t('common.details')}
            </Button>
          </Link>
        )}
      </Flex>

      <OrderProductsList
        lightBackground
        items={order.ordered}
        storeId={storeId}
      />
      <Flex px={[1, 2, 2]} justify='space-between' align='center'>
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
