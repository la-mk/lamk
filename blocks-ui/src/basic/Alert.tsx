import { default as AntAlert, AlertProps } from 'antd/es/alert';
import 'antd/es/alert/style/index.less';

import { system } from '../system';

export const Alert = system<AlertProps>(AntAlert);
