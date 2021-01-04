import { Button, Flex, Heading, Text } from '@la-mk/blocks-ui';
import { TreeviewEntry } from '@la-mk/blocks-ui/dist/basic/Treeview';
import Link from 'next/link';
import React from 'react';

const CategorySection = ({
  getHref,
  item,
  onClick,
}: {
  item: TreeviewEntry;
  getHref: CategoriesListProps['getHref'];
  onClick: () => void;
}) => {
  return (
    <Flex
      direction='column'
      align='flex-start'
      p={[3, 4, 6]}
      minWidth={'16rem'}
    >
      <Heading as='h2' size='sm' mb={2}>
        {item.title}
      </Heading>

      {item.children?.map(x => (
        <Link href={getHref(x.key)} passHref>
          <Button my={2} as='a' variant='link' size='sm' onClick={onClick}>
            {x.title}
          </Button>
        </Link>
      ))}
    </Flex>
  );
};

export interface CategoriesListProps {
  items: TreeviewEntry[];
  getHref: (key: string) => string;
  onClick: () => void;
}

export const CategoriesGrid = ({
  items,
  getHref,
  onClick,
}: CategoriesListProps) => {
  return (
    <Flex direction='row' wrap='wrap'>
      {items?.map(item => (
        <CategorySection item={item} getHref={getHref} onClick={onClick} />
      ))}
    </Flex>
  );
};
