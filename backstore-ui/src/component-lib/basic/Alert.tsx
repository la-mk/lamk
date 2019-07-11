import { default as AntAlert, AlertProps } from 'antd/es/alert';
import 'antd/lib/alert/style/index.less';

import { system } from '../system';

export const Alert = system<AlertProps>(AntAlert);
