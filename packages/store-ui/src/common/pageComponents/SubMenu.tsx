import React from 'react';
import { Flex, Text, Dropdown } from '@sradevski/blocks-ui';
import { withTheme } from 'styled-components';
import { DownOutlined } from '@ant-design/icons';
import { CategoriesMenu } from '../../components/shared/CategoriesMenu';
import { HoverableLink } from '../../components/shared/components/HoverableLink';
import { useTranslation, getTranslationBaseForSet } from '../i18n';
import { sdk } from '@sradevski/la-sdk';
import { ProductSet } from '@sradevski/la-sdk/dist/models/product';
import { getSetHref } from '../filterUtils';

export const SubMenu = withTheme(({ theme, ...otherProps }) => {
  const { t } = useTranslation();
  const sets: ProductSet[] = [
    {
      setTag: { name: 'latest' },
      filter: { query: sdk.product.getQueryForSet({ name: 'latest' }) },
    },
    {
      setTag: { name: 'discounted' },
      filter: { query: sdk.product.getQueryForSet({ name: 'discounted' }) },
    },
  ];

  return (
    <Flex
      {...otherProps}
      width='100%'
      bg='background.dark'
      flexDirection='row'
      alignItems='center'
      justifyContent='flex-start'
      px={[3, 4, 5]}
      style={{ overflowX: 'auto' }}
    >
      <Dropdown
        trigger={['click', 'hover']}
        placement='bottomLeft'
        overlay={<CategoriesMenu mode='horizontal' />}
      >
        <a style={{ textDecoration: 'none' }}>
          <Text style={{ whiteSpace: 'nowrap' }} mx={3} color='text.light'>
            {t('common.category_plural')}
            <DownOutlined
              style={{ margin: 0, marginLeft: 8, fontSize: '0.8em' }}
            />
          </Text>
        </a>
      </Dropdown>

      {sets.map(set => {
        return (
          <HoverableLink key={set.setTag.name} href={getSetHref(set)}>
            <Text style={{ whiteSpace: 'nowrap' }} mx={3} color='text.light'>
              {t(getTranslationBaseForSet({ name: set.setTag.name }))}
            </Text>
          </HoverableLink>
        );
      })}
    </Flex>
  );
});
