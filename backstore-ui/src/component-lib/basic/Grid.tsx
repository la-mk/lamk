import {
  Row as AntRow,
  Col as AntCol,
  RowProps,
  ColProps,
} from 'antd/lib/grid';
import 'antd/lib/grid/style/index.less';

import { system } from '../system';

export const Row = system<RowProps>(AntRow);
export const Col = system<ColProps>(AntCol);
