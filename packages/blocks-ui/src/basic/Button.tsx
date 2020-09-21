import { Button as AntButton } from 'antd';
import { ButtonProps } from 'antd/es/button';
import 'antd/es/button/style/index.less';

import { system } from '../system';

export const Button = system<ButtonProps>(AntButton);
