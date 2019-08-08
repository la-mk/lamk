import { Row as AntRow, Col as AntCol, RowProps, ColProps } from 'antd/es/grid';
import 'antd/es/grid/style/index.less';

import { system } from '../system';

export const Row = system<RowProps>(AntRow);
export const Col = system<ColProps>(AntCol);
