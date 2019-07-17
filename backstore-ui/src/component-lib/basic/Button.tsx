import {
  default as AntButton,
  ButtonProps,
  ButtonGroupProps,
} from 'antd/es/button';
import 'antd/lib/button/style/index.less';

import { system } from '../system';

export const Button = system<ButtonProps>(AntButton as any);
export const ButtonGroup = system<ButtonGroupProps>(AntButton.Group as any);
