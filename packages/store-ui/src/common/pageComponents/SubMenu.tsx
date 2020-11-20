import React from 'react';
import { Flex, Dropdown, Label } from '@sradevski/blocks-ui';
import { withTheme } from 'styled-components';
import { DownOutlined } from '@ant-design/icons';
import { CategoriesMenu } from '../../components/shared/CategoriesMenu';
import { HoverableLink } from '../../components/shared/components/HoverableLink';
import { useSelector } from 'react-redux';
import { useTranslation, getTitleForSet } from '../i18n';
import { sdk } from '@sradevski/la-sdk';
import { ProductSetResult } from '@sradevski/la-sdk/dist/models/product';
import { getSetHref } from '../filterUtils';
import { getPromotedSets } from '../../state/modules/storeContents/storeContents.selector';

export const SubMenu = withTheme(({ theme, ...otherProps }) => {
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
          <Label
            size={'small'}
            mx={3}
            color='contentInversePrimary'
            $style={{ whiteSpace: 'nowrap' }}
          >
            {t('common.category_plural')}
            <DownOutlined
              style={{ margin: 0, marginLeft: 8, fontSize: '0.8em' }}
            />
          </Label>
        </a>
      </Dropdown>

      {sets.map(set => {
        return (
          <HoverableLink key={set.setTag.title} href={getSetHref(set)}>
            <Label
              size={'small'}
              color='contentInversePrimary'
              mx={3}
              $style={{ whiteSpace: 'nowrap' }}
            >
              {set.setTag.title}
            </Label>
          </HoverableLink>
        );
      })}
    </Flex>
  );
});
