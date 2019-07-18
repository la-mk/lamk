import { default as AntPagination, PaginationProps } from 'antd/es/pagination';
import 'antd/lib/pagination/style/index.less';

import { system } from '../system';

export const Pagination = system<PaginationProps>(AntPagination);
