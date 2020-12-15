import React from 'react';
import { TreeviewEntry } from '../../basic/Treeview';
import { Flex } from '../../basic/Flex';
import { Heading } from '../../basic/Heading';
import { Text } from '../../basic/Text';

const CategorySection = ({
  // getHref,
  item,
}: {
  item: TreeviewEntry;
  getHref: CategoriesListProps['getHref'];
}) => {
  return (
    <Flex direction="column" p={6}>
      <Heading as="h2" size="md" mb={2}>
        {item.title}
      </Heading>

      {item.children?.map(x => (
        <Text my={1}>{x.title}</Text>
      ))}
    </Flex>
  );
};

export interface CategoriesListProps {
  items: TreeviewEntry[];
  getHref: (key: string) => string;
}

export const CategoriesList = ({ items, getHref }: CategoriesListProps) => {
  return (
    <Flex direction="row" wrap="wrap">
      {items?.map(item => (
        <CategorySection item={item} getHref={getHref} />
      ))}
    </Flex>
  );
};
