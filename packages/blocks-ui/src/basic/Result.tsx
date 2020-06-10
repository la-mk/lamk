import { Result as AntResult } from 'antd';
import { ResultProps } from 'antd/es/result';
import 'antd/es/result/style/index.less';

import { system } from '../system';

export const Result = system<ResultProps>(AntResult);
