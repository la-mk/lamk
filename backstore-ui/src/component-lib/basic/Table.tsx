import {
  default as AntTable,
  ColumnProps as AntColumnProps,
} from 'antd/es/table';
import 'antd/lib/table/style/index.less';
import 'antd/lib/pagination/style/index.less';

export type ColumnProps<T> = AntColumnProps<T>;
// I am not sure how we can wrap this in system and still be able to pass generics to it.
export const Table = AntTable;
