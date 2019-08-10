import { Pagination as AntPagination } from 'antd';
import { PaginationProps } from 'antd/lib/pagination';
import 'antd/lib/pagination/style/index.less';

import { system } from '../system';

export const Pagination = system<PaginationProps>(AntPagination);
