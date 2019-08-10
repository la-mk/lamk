import { Button as AntButton } from 'antd';
import { ButtonProps, ButtonGroupProps } from 'antd/lib/button';
import 'antd/lib/button/style/index.less';

import { system } from '../system';

export const Button = system<ButtonProps>(AntButton as any);
export const ButtonGroup = system<ButtonGroupProps>(AntButton.Group as any);
