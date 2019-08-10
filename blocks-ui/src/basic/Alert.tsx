import { Alert as AntAlert } from 'antd';
import { AlertProps } from 'antd/lib/alert';
import 'antd/lib/alert/style/index.less';

import { system } from '../system';

export const Alert = system<AlertProps>(AntAlert);
