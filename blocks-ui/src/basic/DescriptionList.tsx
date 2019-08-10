import { Descriptions as AntDescriptions } from 'antd';
import { DescriptionsProps, DescriptionsItemProps } from 'antd/es/descriptions';
import 'antd/es/descriptions/style/index.less';

import { system } from '../system';

export const Descriptions = system<DescriptionsProps>(AntDescriptions);
export const DescriptionItem = system<DescriptionsItemProps>(
  AntDescriptions.Item as any,
);
