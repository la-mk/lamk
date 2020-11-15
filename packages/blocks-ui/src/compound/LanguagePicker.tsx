import React from 'react';
import { Dropdown } from '../basic/Dropdown';
import { Label } from '../basic/Typography';
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
            <Label>Македонски</Label>
          </MenuItem>
          <MenuItem key="en">
            <Label>English</Label>
          </MenuItem>
        </Menu>
      }
    >
      <Flex alignItems="center" height="100%">
        <Button kind="minimal">
          <GlobalOutlined style={{ marginRight: 0 }} />{' '}
          {languageCode.toUpperCase()}
        </Button>
      </Flex>
    </Dropdown>
  );
};
