import { Pagination as AntPagination } from 'antd';
import { PaginationProps } from 'antd/es/pagination';
import 'antd/es/pagination/style/index.less';

import { system } from '../system';

export const Pagination = system<PaginationProps>(AntPagination);
