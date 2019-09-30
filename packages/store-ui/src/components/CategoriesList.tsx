import React from 'react';
import { Flex, Dropdown, Menu, MenuItem, Icon, Text } from 'blocks-ui';

const categories = [
  { level1: 'Men fashion', level2: 'Accessories', level3: 'Watches' },
  { level1: 'Men fashion', level2: 'T-shirts', level3: 'Plain' },
  { level1: 'Men fashion', level2: 'Pants', level3: 'Long' },
  { level1: 'Women fashion', level2: 'Accessories', level3: 'Necklases' },
  { level1: 'Women fashion', level2: 'Dresses', level3: 'Short' },
  { level1: 'Kids fashion', level2: 'Accessories', level3: 'Hats' },
];

export const CategoriesList = () => {
  const topLevelItems = Array.from(
    new Set(categories.map(category => category.level1)),
  );
  const menuItems = categories.reduce((groupedByLevel1: any, category) => {
    if (!groupedByLevel1[category.level1]) {
      groupedByLevel1[category.level1] = [];
    }

    groupedByLevel1[category.level1].push(category.level2);
    return groupedByLevel1;
  }, {});

  return (
    <Flex flexDirection='row' justifyContent='center' mb={4}>
      {topLevelItems.map(level1Item => {
        const menu = (
          <Menu>
            {menuItems[level1Item].map(menuItem => {
              return <MenuItem key={menuItem}>{menuItem}</MenuItem>;
            })}
          </Menu>
        );

        return (
          <Dropdown mt={3} mx={3} key={level1Item} overlay={menu}>
            <div>
              <Text strong>{level1Item}</Text>
              <Icon ml={2} type='down' />
            </div>
          </Dropdown>
        );
      })}
    </Flex>
  );
};
