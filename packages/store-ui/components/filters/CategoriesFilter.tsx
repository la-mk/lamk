import isString from "lodash/isString";
import React from "react";
import { FilterObject } from "@la-mk/blocks-ui/dist/hooks/useFilter";
import { utils, Button, Text, Flex } from "@la-mk/blocks-ui";
import { RefreshCw } from "react-feather";
import { Category } from "../../domain/category";
import { useTranslation } from "next-i18next";
import { CustomCard } from "../CustomCard";
import { CategoriesMenu } from "../../layout/SubMenu/categories/CategoriesMenu";

const parseCategoryFilter = (filtering: FilterObject["filtering"]) => {
  if (!filtering || !filtering.category) {
    return [];
  }

  if (isString(filtering.category)) {
    return [filtering.category];
  }

  return filtering.category.$in || [];
};

interface CategoriesFilterProps {
  filters: FilterObject;
  categories: Category[];
  onChange: (filters: FilterObject) => void;
}

export const CategoriesFilter = ({
  filters,
  categories,
  onChange,
  ...props
}: CategoriesFilterProps & React.ComponentProps<typeof CustomCard>) => {
  const { t } = useTranslation("translation");
  const selectedCategories = parseCategoryFilter(filters.filtering);

  const handleSelectedCategoriesChange = (selectedKeys: string[]) => {
    onChange({
      ...filters,
      // We want to clear the search when selecting a category (for now)
      searching: undefined,
      filtering: {
        ...filters.filtering,
        ...utils.filter.multipleItemsFilter("category", selectedKeys),
      },
    });
  };

  return (
    <CustomCard {...props}>
      <Flex px={3} justify="space-between" mb={4}>
        <Text>{t("common.category_plural")}</Text>
        <Button
          variant="link"
          onClick={() => handleSelectedCategoriesChange([])}
          size="sm"
          leftIcon={<RefreshCw size="1rem" />}
        >
          {t("actions.reset")}
        </Button>
      </Flex>
      <CategoriesMenu
        categories={categories}
        selectedKeys={selectedCategories}
        onSelect={handleSelectedCategoriesChange}
      />
    </CustomCard>
  );
};
