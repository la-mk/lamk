import React, { useCallback } from 'react';
import { Box, Button, Drawer, Flex, hooks, Text } from '@sradevski/blocks-ui';
import { DownOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import { useTranslation, getTitleForSet } from '../i18n';
import { sdk } from '@sradevski/la-sdk';
import { ProductSetResult } from '@sradevski/la-sdk/dist/models/product';
import { getQueryForCategories, getSetHref } from '../filterUtils';
import { getPromotedSets } from '../../state/modules/storeContents/storeContents.selector';
import { CategoriesOverlay } from '../../components/shared/categories/CategoriesOverlay';
import { CategoriesGrid } from '../../components/shared/categories/CategoriesGrid';
import {
  createGetGroupedCategories,
  GroupedCategories,
} from '../../state/modules/categories/categories.selector';

export const SubMenu = props => {
  const [viewedCategory, setViewedCategory] = React.useState<
    string | undefined
  >();
  const [isCategoriesVisible, setIsCategoriesVisible] = React.useState(false);
  const isMobile = hooks.useBreakpoint([true, false, false]);

  const promotedSets = useSelector(getPromotedSets);
  const { t } = useTranslation();

  const getGroupedCategories = useCallback(() => {
    return createGetGroupedCategories((categoryKey: string) =>
      t(`categories.${categoryKey}`),
    );
  }, [t])();

  const groupedCategories: GroupedCategories = useSelector(
    getGroupedCategories,
  );

  const selectedCategoryGroup = groupedCategories?.find(
    c => c.key === viewedCategory,
  );

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
      <Flex align='center'>
        {groupedCategories.map(groupedCategory => {
          return (
            <Box key={groupedCategory.key}>
              <Button
                p={4}
                py={5}
                variant='link'
                // @ts-ignore
                onMouseEnter={() => {
                  if (isMobile) {
                    return;
                  }
                  setViewedCategory(groupedCategory.key);
                  setIsCategoriesVisible(true);
                }}
                onMouseLeave={() => {
                  if (isMobile) {
                    return;
                  }
                  setIsCategoriesVisible(false);
                }}
                onClick={() => {
                  setViewedCategory(groupedCategory.key);
                  setIsCategoriesVisible(x => !x);
                }}
                leftIcon={
                  <Text size='xs' color='text.light'>
                    <DownOutlined />
                  </Text>
                }
              >
                <Text whiteSpace='nowrap' color='text.light'>
                  {groupedCategory.title}
                </Text>
              </Button>
            </Box>
          );
        })}
      </Flex>

      {!isMobile && (
        <CategoriesOverlay
          isOpen={isCategoriesVisible}
          setIsOpen={setIsCategoriesVisible}
        >
          <CategoriesGrid
            onClick={() => setIsCategoriesVisible(false)}
            getHref={(categoryKey: string) =>
              `/products?${getQueryForCategories([categoryKey])}`
            }
            items={
              groupedCategories?.find(c => c.key === viewedCategory)
                ?.children ?? []
            }
          />
        </CategoriesOverlay>
      )}

      {isMobile && (
        <Drawer
          size='xs'
          title={selectedCategoryGroup?.title ?? t('common.category_plural')}
          isOpen={isCategoriesVisible}
          onClose={() => setIsCategoriesVisible(false)}
          placement='left'
        >
          <CategoriesGrid
            onClick={() => setIsCategoriesVisible(false)}
            getHref={(categoryKey: string) =>
              `/products?${getQueryForCategories([categoryKey])}`
            }
            items={selectedCategoryGroup?.children ?? []}
          />
        </Drawer>
      )}

      {sets.map(set => {
        return (
          // Wrapping it in Box so it overflows as expected on mobile.
          <Box key={set.setTag.title}>
            <Link key={set.setTag.title} href={getSetHref(set)} passHref>
              <Button p={4} variant='link'>
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
