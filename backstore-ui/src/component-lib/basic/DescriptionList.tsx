import {
  default as AntDescriptions,
  DescriptionsProps,
  DescriptionsItemProps,
} from 'antd/es/descriptions';
import 'antd/lib/descriptions/style/index.less';

import { system } from '../system';

export const Descriptions = system<DescriptionsProps>(AntDescriptions);
export const DescriptionItem = system<DescriptionsItemProps>(
  AntDescriptions.Item as any,
);
