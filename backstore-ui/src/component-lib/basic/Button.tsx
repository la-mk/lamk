import {
  default as AntButton,
  ButtonProps,
  ButtonGroupProps,
} from 'antd/es/button';
import 'antd/lib/button/style/index.less';

import { system } from '../system';
import styled from 'styled-components';

export const Button = styled(system<ButtonProps>(AntButton as any))`
  & > i {
    vertical-align: middle;
  }
`;

export const ButtonGroup = system<ButtonGroupProps>(AntButton.Group as any);
