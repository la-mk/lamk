import { default as AntCard, CardProps, CardMetaProps } from 'antd/es/card';
import 'antd/lib/card/style/index.less';

import { system } from '../system';

export const Card = system<CardProps>(AntCard);
export const CardMeta = system<CardMetaProps>(AntCard.Meta as any);
