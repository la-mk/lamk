import { storiesOf } from '@storybook/react';
import * as React from 'react';
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
} from './';
import { Provider } from '../../';
import { Button } from '../Button';
import { Box } from '../Box';

storiesOf('Menu', module).add('standard', () => (
  <Provider>
    <Box>
      <Menu>
        <MenuButton m={3} as={Button}>
          Menu
        </MenuButton>
        <MenuList>
          <MenuGroup title="First group">
            <MenuItem>First</MenuItem>
            <MenuItem>Second</MenuItem>
            <MenuItem>Third</MenuItem>
          </MenuGroup>

          <MenuDivider />
          <MenuGroup title="Second group">
            <MenuItem>Primary</MenuItem>
            <MenuItem>Secondary</MenuItem>
            <MenuItem>Tertiary</MenuItem>
          </MenuGroup>
        </MenuList>
      </Menu>

      <Menu closeOnSelect={false}>
        <MenuButton m={3} as={Button}>
          Options
        </MenuButton>
        <MenuList>
          <MenuOptionGroup
            title="First group"
            type="checkbox"
            value={['first', 'second']}
          >
            <MenuItemOption value="first">First</MenuItemOption>
            <MenuItemOption value="second">Second</MenuItemOption>
            <MenuItemOption value="third">Third</MenuItemOption>
          </MenuOptionGroup>

          <MenuDivider />
          <MenuOptionGroup title="Second group" value="primary" type="radio">
            <MenuItemOption value="primary">Primary</MenuItemOption>
            <MenuItemOption value="secondary">Secondary</MenuItemOption>
            <MenuItemOption value="tertiary">Tertiary</MenuItemOption>
          </MenuOptionGroup>
        </MenuList>
      </Menu>
    </Box>
  </Provider>
));
