import React from 'react';
import { Text } from '../basic/Text';
import {
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
} from '../basic/Menu';
import { GlobalOutlined } from '@ant-design/icons';
import { Button } from '../basic/Button';
import { Portal } from '@chakra-ui/react';

export interface LanguagePickerProps {
  darkMode?: boolean;
  languageCode: string;
  onChangeLanguageCode: (languageCode: string) => void;
}

export const LanguagePicker = ({
  darkMode,
  languageCode,
  onChangeLanguageCode,
}: LanguagePickerProps) => {
  return (
    <Menu>
      <MenuButton
        // @ts-ignore
        colorScheme={darkMode ? 'white' : 'blackAlpha'}
        as={Button}
        variant="link"
        leftIcon={<GlobalOutlined style={{ marginRight: 0 }} />}
      >
        <Text>{languageCode.toUpperCase()}</Text>
      </MenuButton>

      <Portal>
        {/* @ts-ignore */}
        <MenuList color="text.dark">
          <MenuOptionGroup
            defaultValue={'mk'}
            onChange={val => onChangeLanguageCode(val as string)}
            value={languageCode}
            type="radio"
          >
            <MenuItemOption value="mk">
              <Text>Македонски</Text>
            </MenuItemOption>
            <MenuItemOption value="en">
              <Text>English</Text>
            </MenuItemOption>
          </MenuOptionGroup>
        </MenuList>
      </Portal>
    </Menu>
  );
};
