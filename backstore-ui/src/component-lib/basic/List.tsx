import { default as AntList, ListProps as AntListProps } from 'antd/es/list';
import 'antd/lib/list/style/index.less';

export type ListProps<T> = AntListProps<T>;
// I am not sure how we can wrap this in system and still be able to pass generics to it.
export const List = AntList;
