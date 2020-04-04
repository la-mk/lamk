import isString from 'lodash/isString';
import React, { useCallback } from 'react';
import { Menu, MenuItem, Text, Button, SubMenu } from '@sradevski/blocks-ui';
import { DownOutlined } from '@ant-design/icons';
import {
  getCategories,
  GroupedCategories,
  createGetGroupedCategories,
} from '../../state/modules/categories/categories.selector';
import { useSelector } from 'react-redux';
import { useTranslation } from '../../common/i18n';
import Link from 'next/link';
import queryString from 'qs';
import { MenuProps } from 'antd/es/menu';
import { Category } from '@sradevski/la-sdk/dist/models/category';

const getQueryString = (categories: string | string[]) => {
  if (isString(categories)) {
    return queryString.stringify({ f: { category: categories } });
  }

  return queryString.stringify({ f: { category: { $in: categories } } });
};

export interface CategoriesMenuProps {
  mode: MenuProps['mode'];
  selectedKeys?: MenuProps['selectedKeys'];
  onSelect?: MenuProps['onSelect'];
}

export const CategoriesMenu = ({
  mode,
  selectedKeys,
  onSelect,
}: CategoriesMenuProps) => {
  const categories: Category[] = useSelector(getCategories);
  const { t } = useTranslation();

  const getGroupedCategories = useCallback(() => {
    return createGetGroupedCategories((categoryKey: string) =>
      t(`categories.${categoryKey}`),
    );
  }, [t])();

  const groupedCategories: GroupedCategories = useSelector(
    getGroupedCategories,
  );

  const defaultOpenKeys = React.useMemo(() => {
    if (!selectedKeys || !selectedKeys.length) {
      return [];
    }

    // This is somewhat inefficient, but it shouldn't be a problem due to the relatively small number of selected categories.
    return (categories || [])
      .filter(x => selectedKeys.includes(x.level3))
      .flatMap(x => [x.level1, x.level2]);
  }, []);

  if (!categories) {
    return null;
  }

  return (
    <Menu
      defaultOpenKeys={defaultOpenKeys}
      mode={mode}
      multiple
      width={mode === 'horizontal' ? '100%' : '280px'}
      height='100%'
      style={{ border: 'none' }}
      selectedKeys={selectedKeys}
      onSelect={onSelect}
      onDeselect={onSelect}
    >
      {groupedCategories.map(level1Category => {
        return (
          <SubMenu
            key={level1Category.value}
            title={
              mode === 'horizontal' ? (
                <Text>
                  {level1Category.label}
                  <DownOutlined style={{ marginLeft: 8 }} />
                </Text>
              ) : (
                level1Category.label
              )
            }
          >
            {level1Category.children.map(level2Category => {
              return (
                <SubMenu
                  key={level2Category.value}
                  title={level2Category.label}
                >
                  {level2Category.children.map(level3Category => {
                    return (
                      <MenuItem
                        key={level3Category.value}
                        title={level3Category.label}
                      >
                        {onSelect && (
                          <Button type='link'>
                            <Text>{level3Category.label}</Text>
                          </Button>
                        )}
                        {!onSelect && (
                          <Link
                            key={level3Category.value}
                            href={`/products?${getQueryString([
                              level3Category.value,
                            ])}`}
                          >
                            <Button type='link'>
                              <Text>{level3Category.label}</Text>
                            </Button>
                          </Link>
                        )}
                      </MenuItem>
                    );
                  })}
                </SubMenu>
              );
            })}
          </SubMenu>
        );
      })}
    </Menu>
  );
};
