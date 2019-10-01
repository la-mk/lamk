import { Empty as AntEmpty } from 'antd';
import { EmptyProps } from 'antd/es/empty';
import 'antd/es/empty/style/index.less';

import { system } from '../system';

export const Empty = system<EmptyProps>(AntEmpty as any);
