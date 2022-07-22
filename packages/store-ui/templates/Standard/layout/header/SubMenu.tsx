import React, { useMemo } from "react";
import { Box, Button, Drawer, Flex, hooks, Text } from "@la-mk/blocks-ui";
import { ChevronDown } from "react-feather";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { useTheme } from "@chakra-ui/react";
import { getCategoryHref } from "../../../../tooling/url";
import { getGroupedCategories } from "../../../../domain/category";
import { getQueryForSet, getSetHref } from "../../../../domain/set";
import { CategoriesOverlay } from "../../components/categories/CategoriesOverlay";
import { CategoriesGrid } from "../../components/categories/CategoriesGrid";
import { HeaderProps } from "../../../../containers/layout/Header";

export const SubMenu = ({
  sets,
  categories,
}: Pick<HeaderProps, "sets" | "categories">) => {
  const [viewedCategory, setViewedCategory] = React.useState<
    string | undefined
  >();
  const isMobile = hooks.useBreakpoint([true, false, false]);
  const { t } = useTranslation("translation");
  const theme = useTheme();
  const ownTheme = theme.sections.SubMenu;

  const groupedCategories = useMemo(() => {
    return getGroupedCategories(categories, (categoryKey: string) =>
      t(`categories.${categoryKey}`)
    );
  }, [t, categories]);

  const [isCategoriesVisible, setIsCategoriesVisible] = React.useState(false);
  const selectedCategoryGroup = groupedCategories?.find(
    (c) => c.key === viewedCategory
  );

  return (
    <Flex
      width="100%"
      bg="background.dark"
      direction="row"
      align="center"
      px={[3, 4, 5]}
      // @ts-ignore
      whiteSpace="nowrap"
      // @ts-ignore
      style={{ overflowX: "auto" }}
    >
      {/* We use these boxes to center the menu items, while x overflow works (it wouldn't with justify center) */}
      <Box ml={ownTheme.menu.position === "left" ? 0 : "auto"} />

      {groupedCategories.map((groupedCategory) => {
        return (
          <Box display="inline-block" key={groupedCategory.key}>
            <Button
              p={ownTheme.menu.spacing === "large" ? [5, 5, 6] : [4, 4, 4]}
              py={[5, 5, 5]}
              variant="link"
              // @ts-ignore
              onMouseEnter={(e) => {
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
              onClick={(e) => {
                setViewedCategory(groupedCategory.key);
                setIsCategoriesVisible((x) => !x);
              }}
              leftIcon={
                <Text size="sm" color="text.light">
                  <ChevronDown size="1rem" />
                </Text>
              }
            >
              <Text
                whiteSpace="nowrap"
                color="text.light"
                // @ts-ignore
                textTransform={ownTheme.menu.textTransform}
              >
                {groupedCategory.title}
              </Text>
            </Button>
          </Box>
        );
      })}

      {sets.map((set) => {
        const setHref = getSetHref({
          setTag: set,
          filter: {
            query: getQueryForSet({
              type: set.type,
              value: set.value,
            }),
          },
        });

        return (
          // Wrapping it in Box so it overflows as expected on mobile.
          <Box display="inline-block" key={set.title}>
            <Link key={set.title} href={setHref} passHref>
              <Button
                p={ownTheme.menu.spacing === "large" ? [5, 5, 6] : [4, 4, 4]}
                py={[5, 5, 5]}
                variant="link"
              >
                <Text
                  whiteSpace="nowrap"
                  color="text.light"
                  // @ts-ignore
                  textTransform={ownTheme.menu.textTransform}
                >
                  {set.title}
                </Text>
              </Button>
            </Link>
          </Box>
        );
      })}

      <Box mr={ownTheme.menu.position === "left" ? 0 : "auto"} />

      {!isMobile && (
        <CategoriesOverlay
          isOpen={isCategoriesVisible}
          setIsOpen={setIsCategoriesVisible}
        >
          <CategoriesGrid
            onClick={() => setIsCategoriesVisible(false)}
            getHref={getCategoryHref}
            items={
              groupedCategories?.find((c) => c.key === viewedCategory)
                ?.children ?? []
            }
          />
        </CategoriesOverlay>
      )}

      {isMobile && (
        <Drawer
          size="xs"
          title={selectedCategoryGroup?.title ?? t("common.category_plural")}
          isOpen={isCategoriesVisible}
          onClose={() => setIsCategoriesVisible(false)}
          placement="left"
        >
          <CategoriesGrid
            onClick={() => setIsCategoriesVisible(false)}
            getHref={getCategoryHref}
            items={selectedCategoryGroup?.children ?? []}
          />
        </Drawer>
      )}
    </Flex>
  );
};
