import React, { useMemo } from "react";
import { Treeview } from "@la-mk/blocks-ui";
import { useTranslation } from "next-i18next";
import { Category, getGroupedCategories } from "../../../../domain/category";

export interface CategoriesMenuProps {
  categories: Category[];
  selectedKeys?: string[];
  onSelect?: (selected: string[]) => void;
}

export const CategoriesMenu = ({
  selectedKeys,
  onSelect,
  categories,
}: CategoriesMenuProps) => {
  const { t } = useTranslation("translation");

  const groupedCategories = useMemo(() => {
    return getGroupedCategories(categories, (categoryKey: string) =>
      t(`categories.${categoryKey}`)
    );
  }, [categories, t]);

  if (!categories) {
    return null;
  }
  // Pass `multiple` if we want to allow multiple category selection
  return (
    <Treeview
      items={groupedCategories}
      selected={selectedKeys}
      onSelect={onSelect}
    />
  );
};
