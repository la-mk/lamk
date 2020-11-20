import React, { useCallback } from 'react';
import { Menu, MenuItem, Label, Button, SubMenu } from '@sradevski/blocks-ui';
import {
  getCategories,
  GroupedCategories,
  createGetGroupedCategories,
} from '../../state/modules/categories/categories.selector';
import { useSelector } from 'react-redux';
import { useTranslation } from '../../common/i18n';
import Link from 'next/link';
import { MenuProps } from 'antd/es/menu';
import { Category } from '@sradevski/la-sdk/dist/models/category';
import { getQueryForCategories } from '../../common/filterUtils';
import { CheckOutlined } from '@ant-design/icons';
import { HoverableLink } from './components/HoverableLink';

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
      style={{ border: 'none' }}
      selectedKeys={selectedKeys}
      onSelect={onSelect}
      onDeselect={onSelect}
    >
      {groupedCategories.map(level1Category => {
        return (
          <SubMenu key={level1Category.value} title={level1Category.label}>
            {level1Category.children.map(level2Category => {
              return (
                <SubMenu
                  key={level2Category.value}
                  title={level2Category.label}
                >
                  {level2Category.children.map(level3Category => {
                    const isSelected =
                      selectedKeys &&
                      selectedKeys.includes(level3Category.value as string);

                    return (
                      <MenuItem
                        style={{ display: 'flex', alignItems: 'center' }}
                        key={level3Category.value}
                        title={level3Category.label}
                      >
                        {/* Compensate for the checkmark by moving the button to the left */}
                        {onSelect && (
                          <Label
                            ml={-20}
                            size='xsmall'
                            color={isSelected ? 'primary' : 'contentPrimary'}
                          >
                            <CheckOutlined
                              style={{
                                color: isSelected ? 'inherit' : 'transparent',
                              }}
                            />
                            {level3Category.label}
                          </Label>
                        )}
                        {!onSelect && (
                          <HoverableLink
                            passHref
                            key={level3Category.value}
                            href={`/products?${getQueryForCategories([
                              level3Category.value as string,
                            ])}`}
                          >
                            <Label size='xsmall'>{level3Category.label}</Label>
                          </HoverableLink>
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
