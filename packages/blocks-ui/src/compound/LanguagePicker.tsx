import React from 'react';
import { Dropdown } from '../basic/Dropdown';
import { Text } from '../basic/Typography';
import { Button } from '../basic/Button';
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
      <Flex alignItems="center" height="100%">
        <Button p={0} display="block" type="link" style={{ color: 'inherit' }}>
          <GlobalOutlined style={{ marginRight: 0 }} />{' '}
          {languageCode.toUpperCase()}
        </Button>
      </Flex>
    </Dropdown>
  );
};
