import { Input as AntInput } from 'antd';
import {
  InputProps,
  TextAreaProps,
  GroupProps,
  SearchProps,
  PasswordProps,
} from 'antd/es/input';
import 'antd/es/input/style/index.less';

import { system } from '../system';
import styled from 'styled-components';

export const Input = system<InputProps>(AntInput);
export const TextArea = system<TextAreaProps>(AntInput.TextArea);
export const InputGroup = system<GroupProps>(AntInput.Group);
export const Search = system<SearchProps>(AntInput.Search);
export const Password = system<PasswordProps>(
  styled(AntInput.Password)`
    box-sizing: border-box;
  `
);
