import {
  Menu as ChakraMenu,
  MenuProps as ChakraMenuProps,
  MenuItemProps as ChakraMenuItemProps,
  MenuGroupProps as ChakraMenuGroupProps,
  MenuOptionGroupProps as ChakraMenuOptionGroupProps,
  MenuItemOptionProps as ChakraMenuItemOptionProps,
  MenuButton as ChakraMenuButton,
  MenuList as ChakraMenuList,
  MenuItem as ChakraMenuItem,
  MenuItemOption as ChakraMenuItemOption,
  MenuGroup as ChakraMenuGroup,
  MenuOptionGroup as ChakraMenuOptionGroup,
  MenuDivider as ChakraMenuDivider,
  SpaceProps,
} from '@chakra-ui/react';
import { ButtonProps } from '../Button';
import { MaxWidthProps, MinWidthProps } from 'styled-system';

export interface MenuProps
  extends Pick<ChakraMenuProps, 'closeOnSelect' | 'isLazy' | 'children'> {}

export interface MenuButtonProps extends ButtonProps {}

export interface MenuListProps extends MinWidthProps, MaxWidthProps {
  children: React.ReactNode;
}
export interface MenuItemProps
  extends Pick<
    ChakraMenuItemProps,
    'onClick' | 'children' | 'command' | 'icon' | 'isDisabled'
  > {}

export interface MenuItemOptionProps
  extends Pick<
    ChakraMenuItemOptionProps,
    'children' | 'command' | 'icon' | 'isDisabled' | 'type' | 'value'
  > {}

export interface MenuGroupProps
  extends Pick<ChakraMenuGroupProps, 'title' | 'children'> {}

export interface MenuOptionGroupProps
  extends Pick<
    ChakraMenuOptionGroupProps,
    'title' | 'type' | 'defaultValue' | 'children' | 'onChange' | 'value'
  > {}

export interface MenuDividerProps extends SpaceProps {}

export const Menu = ChakraMenu as React.FunctionComponent<MenuProps>;
export const MenuButton = ChakraMenuButton as React.FunctionComponent<
  MenuButtonProps
>;
export const MenuList = ChakraMenuList as React.FunctionComponent<
  MenuListProps
>;
export const MenuItem = ChakraMenuItem as React.FunctionComponent<
  MenuItemProps
>;

export const MenuItemOption = ChakraMenuItemOption as React.FunctionComponent<
  MenuItemOptionProps
>;

export const MenuGroup = ChakraMenuGroup as React.FunctionComponent<
  MenuGroupProps
>;

export const MenuOptionGroup = ChakraMenuOptionGroup as React.FunctionComponent<
  MenuOptionGroupProps
>;

export const MenuDivider = ChakraMenuDivider as React.FunctionComponent<
  MenuDividerProps
>;
