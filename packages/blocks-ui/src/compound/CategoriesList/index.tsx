import React from 'react';
import { TreeviewEntry } from '../../basic/Treeview';
import { Flex } from '../../basic/Flex';
import { Heading } from '../../basic/Heading';
import { Text } from '../../basic/Text';
import { Fade } from '@chakra-ui/react';

const Overlay = ({
  children,
  trigger,
}: {
  children: React.ReactNode;
  trigger: CategoriesListProps['trigger'];
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [triggerHeight, setTriggerHeight] = React.useState(0);

  const ref = React.useCallback(node => {
    if (node !== null) {
      setTriggerHeight(node.getBoundingClientRect().height);
    }
  }, []);
  return (
    <div style={{ position: 'relative' }}>
      <div ref={ref}>
        {trigger({
          toggle: () => setIsOpen(x => !x),
          open: () => setIsOpen(true),
          close: () => setIsOpen(false),
        })}
      </div>
      <Fade unmountOnExit in={isOpen}>
        <div
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
          style={{ position: 'absolute', left: 0, top: triggerHeight }}
        >
          {children}
        </div>
      </Fade>
    </div>
  );
};

const CategorySection = ({
  item,
}: // getHref,
{
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
  trigger: ({
    toggle,
    open,
    close,
  }: {
    toggle: () => void;
    open: () => void;
    close: () => void;
  }) => React.ReactNode;
}

export const CategoriesList = ({
  items,
  getHref,
  trigger,
}: CategoriesListProps) => {
  return (
    <Overlay trigger={trigger}>
      <Flex direction="row" wrap="wrap">
        {items.map(item => (
          <CategorySection item={item} getHref={getHref} />
        ))}
      </Flex>
    </Overlay>
  );
};
