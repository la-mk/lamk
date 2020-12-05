import React from 'react';
import { Dropdown } from '../basic/Dropdown';
import { Text } from '../basic/Text';
import { Flex } from '../basic/Flex';
import { Menu, MenuItem } from '../basic/Menu';
import { GlobalOutlined } from '@ant-design/icons';

export interface LanguagePickerProps {
  languageCode: string;
  onChangeLanguageCode: (languageCode: string) => void;
}

export const LanguagePicker = ({
  languageCode,
  onChangeLanguageCode,
}: LanguagePickerProps) => {
  return (
    <Dropdown
      placement="bottomLeft"
      overlay={
        <Menu
          selectedKeys={[languageCode]}
          onClick={({ key }) => {
            onChangeLanguageCode(key as string);
          }}
        >
          <MenuItem key="mk">
            <Text>Македонски</Text>
          </MenuItem>
          <MenuItem key="en">
            <Text>English</Text>
          </MenuItem>
        </Menu>
      }
    >
      {/* @ts-ignore */}
      <Flex style={{ cursor: 'pointer' }} align="center" height="100%">
        <Text color="inherit" mr={1}>
          <GlobalOutlined style={{ marginRight: 0 }} />
        </Text>
        <Text color="inherit">{languageCode.toUpperCase()}</Text>
      </Flex>
    </Dropdown>
  );
};
