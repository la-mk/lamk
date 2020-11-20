import React from 'react';
import {
  Flex,
  Box,
  Heading,
  Paragraph,
  Button,
  Label,
} from '@sradevski/blocks-ui';
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
      <Flex
        mb={3}
        flexDirection='row'
        alignItems='center'
        justifyContent='space-between'
      >
        <Flex alignItems='center' justifyContent='center'>
          <Box display={['none', 'initial', 'initial']}>
            <Heading
              my={0}
              mr={3}
              as='h2'
              size='xsmall'
              color='contentSecondary'
            >
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
          <Label
            color={sdk.order.orderStatusColor[order.status]}
            ml={1}
            size='xsmall'
          >
            {t(`orderStatus.${order.status}`)}
          </Label>
        </Flex>
        {!hideDetailsButton && (
          <Button startEnhancer={<EyeFilled />} size='compact' kind='minimal'>
            <Link href='/orders/[pid]' as={`/orders/${order._id}`}>
              {t('common.details')}
            </Link>
          </Button>
        )}
      </Flex>

      <OrderProductsList
        lightBackground
        items={order.ordered}
        storeId={storeId}
      />
      <Flex px={[1, 2, 2]} justifyContent='space-between' alignItems='center'>
        <Paragraph
          mr={2}
          size={['small', 'small', 'medium']}
          color='contentSecondary'
        >
          {/* TODO: Show expected delivery */}
          {/* Expected delivery between 1 and 2 */}
        </Paragraph>
        <Paragraph ml={2} size={'small'} color='contentTertiary'>
          {t('order.ordered')}{' '}
          {formatDistanceToNow(new Date(order.createdAt), {
            // TODO: Handle locales better
            locale: i18n.language === 'mk' ? mk : enUS,
            addSuffix: true,
          })}
        </Paragraph>
      </Flex>
    </>
  );
};
