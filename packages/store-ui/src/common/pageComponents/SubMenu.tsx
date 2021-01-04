import React, { useCallback } from 'react';
import { Box, Button, Drawer, Flex, hooks, Text } from '@la-mk/blocks-ui';
import { DownOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import { useTranslation, getTitleForSet } from '../i18n';
import { sdk } from '@la-mk/la-sdk';
import { ProductSetResult } from '@la-mk/la-sdk/dist/models/product';
import { useTheme } from '@chakra-ui/react';
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
  const theme = useTheme();
  const ownTheme = theme.sections.SubMenu;

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
      px={[3, 4, 5]}
      whiteSpace='nowrap'
    >
      <Box
        mx={ownTheme.menu.position === 'left' ? 0 : 'auto'}
        px={1}
        // @ts-ignore
        style={{ overflowX: 'auto' }}
      >
        {groupedCategories.map(groupedCategory => {
          return (
            <Box display='inline-block' key={groupedCategory.key}>
              <Button
                p={4}
                py={5}
                variant='link'
                // @ts-ignore
                onMouseEnter={e => {
                  if (isMobile) {
                    return;
                  }
                  setViewedCategory(groupedCategory.key);
                  setIsCategoriesVisible(true);
                }}
                onMouseLeave={e => {
                  if (isMobile) {
                    return;
                  }
                  setIsCategoriesVisible(false);
                }}
                onClick={e => {
                  setViewedCategory(groupedCategory.key);
                  setIsCategoriesVisible(x => !x);
                }}
                leftIcon={
                  <Text size='xs' color='text.light'>
                    <DownOutlined />
                  </Text>
                }
              >
                <Text
                  whiteSpace='nowrap'
                  color='text.light'
                  // @ts-ignore
                  textTransform={ownTheme.menu.textTransform}
                >
                  {groupedCategory.title}
                </Text>
              </Button>
            </Box>
          );
        })}

        {sets.map(set => {
          return (
            // Wrapping it in Box so it overflows as expected on mobile.
            <Box display='inline-block' key={set.setTag.title}>
              <Link key={set.setTag.title} href={getSetHref(set)} passHref>
                <Button p={4} variant='link'>
                  <Text
                    whiteSpace='nowrap'
                    color='text.light'
                    // @ts-ignore
                    textTransform={ownTheme.menu.textTransform}
                  >
                    {set.setTag.title}
                  </Text>
                </Button>
              </Link>
            </Box>
          );
        })}
      </Box>

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
    </Flex>
  );
};
