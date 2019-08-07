import {
  default as AntInput,
  InputProps,
  TextAreaProps,
  GroupProps,
  SearchProps,
  PasswordProps,
} from 'antd/es/input';
import 'antd/es/input/style/index.less';

import { system } from '../system';

export const Input = system<InputProps>(AntInput);
export const TextArea = system<TextAreaProps>(AntInput.TextArea);
export const InputGroup = system<GroupProps>(AntInput.Group as any);
export const Search = system<SearchProps>(AntInput.Search);
export const Password = system<PasswordProps>(AntInput.Password);
