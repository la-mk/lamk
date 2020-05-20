import { Breadcrumb as AntBreadcrumb } from 'antd';
import { BreadcrumbProps, BreadcrumbItemProps } from 'antd/es/breadcrumb';
import 'antd/es/breadcrumb/style/index.less';

import { system } from '../system';

export const Breadcrumb = system<BreadcrumbProps>(AntBreadcrumb);
export const BreadcrumbItem = system<BreadcrumbItemProps>(AntBreadcrumb.Item);
export const BreadcrumbSeparator = system<{children: React.ReactNode}>(AntBreadcrumb.Separator);


