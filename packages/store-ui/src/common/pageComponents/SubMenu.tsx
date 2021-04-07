import React, { useCallback } from 'react';
import { Box, Button, Drawer, Flex, hooks, Text } from '@la-mk/blocks-ui';
import { ChevronDown } from 'react-feather';
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

import { createStandaloneToast, UseToastOptions } from '@chakra-ui/react';

const showToast = (options: UseToastOptions) => {
  const standaloneToast = createStandaloneToast();
  standaloneToast({
    ...options,
    variant: 'subtle',
    position: 'top',
    isClosable: true,
  });
};

export const SubMenu = props => {
  const [viewedCategory, setViewedCategory] = React.useState<
    string | undefined
  >();
  const [isCategoriesVisible, setIsCategoriesVisible] = React.useState(false);
  const isMobile = hooks.useBreakpoint([true, false, false]);
  const { t } = useTranslation();
  const theme = useTheme();
  const ownTheme = theme.sections.SubMenu;

  const promotedSets = useSelector(getPromotedSets);

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
      setTag: {
        ...set,
        title:
          set.title ?? t(getTitleForSet({ type: set.type, value: undefined })),
      },
      filter: {
        query: sdk.product.getQueryForSet({ type: set.type, value: set.value }),
      },
    })),
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
      // @ts-ignore
      style={{ overflowX: 'auto' }}
    >
      {/* We use these boxes to center the menu items, while x overflow works (it wouldn't with justify center) */}
      <Box ml={ownTheme.menu.position === 'left' ? 0 : 'auto'} />

      {groupedCategories.map(groupedCategory => {
        return (
          <Box display='inline-block' key={groupedCategory.key}>
            <Button
              p={ownTheme.menu.spacing === 'large' ? [5, 5, 6] : [4, 4, 4]}
              py={[5, 5, 5]}
              variant='link'
              // @ts-ignore
              onMouseEnter={e => {
                if (isMobile) {
                  return;
                }
                showToast({ description: 'hey', duration: 200000 });
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
                <Text size='sm' color='text.light'>
                  <ChevronDown size='1rem' />
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
              <Button
                p={ownTheme.menu.spacing === 'large' ? [5, 5, 6] : [4, 4, 4]}
                py={[5, 5, 5]}
                variant='link'
              >
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

      <Box mr={ownTheme.menu.position === 'left' ? 0 : 'auto'} />

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
