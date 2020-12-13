import React from 'react';
import { Box, Button, Flex, Text } from '@sradevski/blocks-ui';
// import { DownOutlined } from '@ant-design/icons';
// import { CategoriesMenu } from '../../components/shared/CategoriesMenu';
import { useSelector } from 'react-redux';
import { useTranslation, getTitleForSet } from '../i18n';
import { sdk } from '@sradevski/la-sdk';
import { ProductSetResult } from '@sradevski/la-sdk/dist/models/product';
import { getSetHref } from '../filterUtils';
import { getPromotedSets } from '../../state/modules/storeContents/storeContents.selector';
import Link from 'next/link';

export const SubMenu = props => {
  const promotedSets = useSelector(getPromotedSets);
  const { t } = useTranslation();
  const sets: Array<ProductSetResult> = [
    ...promotedSets.map(set => ({
      setTag: set,
      filter: {
        query: sdk.product.getQueryForSet({ type: set.type, value: set.value }),
      },
    })),
    {
      setTag: {
        type: 'discounted',
        title: t(getTitleForSet({ type: 'discounted', value: undefined })),
      },
      filter: {
        query: sdk.product.getQueryForSet({
          type: 'discounted',
          value: undefined,
        }),
      },
    },
    {
      setTag: {
        type: 'latest',
        title: t(getTitleForSet({ type: 'latest', value: undefined })),
      },
      filter: {
        query: sdk.product.getQueryForSet({ type: 'latest', value: undefined }),
      },
    },
  ];

  return (
    <Flex
      {...props}
      width='100%'
      bg='background.dark'
      direction='row'
      align='center'
      justify='flex-start'
      px={[3, 4, 5]}
      // @ts-ignore
      style={{ overflowX: 'auto' }}
    >
      {/* <Dropdown
        trigger={['click', 'hover']}
        placement='bottomLeft'
        overlay={<CategoriesMenu mode='horizontal' />}
      >
        <a style={{ textDecoration: 'none' }}>
          <Text whiteSpace='nowrap' mx={3} color='text.light'>
            {t('common.category_plural')}
            <DownOutlined
              style={{ margin: 0, marginLeft: 8, fontSize: '0.8em' }}
            />
          </Text>
        </a>
      </Dropdown> */}

      {sets.map(set => {
        return (
          // Wrapping it in Box so it overflows as expected on mobile.
          <Box key={set.setTag.title}>
            <Link key={set.setTag.title} href={getSetHref(set)} passHref>
              <Button mx={4} variant='link'>
                <Text whiteSpace='nowrap' color='text.light'>
                  {set.setTag.title}
                </Text>
              </Button>
            </Link>
          </Box>
        );
      })}
    </Flex>
  );
};
