import React from 'react';
import {
  List as ChakraList,
  UnorderedList as ChakraUnorderedList,
  OrderedList as ChakraOrderedList,
  ListItem as ChakraListItem,
  ListIcon as ChakraListIcon,
  SpaceProps,
} from '@chakra-ui/react';

export interface ListItem {
  content: string;
  icon?: React.ElementType;
}

const variants = {
  ordered: ChakraOrderedList,
  unordered: ChakraUnorderedList,
  plain: ChakraList,
};

export interface ListProps extends SpaceProps {
  variant?: 'ordered' | 'unordered' | 'plain';
  items: ListItem[];
}

export const List = ({ variant, items, ...props }: ListProps) => {
  const ListParent = variants[variant ?? 'plain'];
  return (
    // @ts-ignore
    <ListParent spacing={2} {...props}>
      {items.map((item, i) => {
        return (
          <ChakraListItem key={i} color="text.dark">
            {item.icon && <ChakraListIcon as={item.icon} color="green.500" />}
            {item.content}
          </ChakraListItem>
        );
      })}
    </ListParent>
  );
};
