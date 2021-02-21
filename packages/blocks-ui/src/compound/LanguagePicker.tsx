import React from 'react';
import { Text } from '../basic/Text';
import {
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
} from '../basic/Menu';
import { Globe } from 'react-feather';
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
        leftIcon={<Globe size="1.2rem" />}
      >
        <Text color={darkMode ? 'text.light' : 'text.dark'}>
          {languageCode.toUpperCase()}
        </Text>
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
