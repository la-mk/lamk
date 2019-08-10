import { Card as AntCard } from 'antd';
import { CardProps, CardMetaProps } from 'antd/lib/card';
import 'antd/lib/card/style/index.less';

import { system } from '../system';
import styled from 'styled-components';

export const Card = styled(system<CardProps>(AntCard))`
  & li {
    box-sizing: border-box;
  }

  .ant-card-head-wrapper {
    align-items: flex-start;
  }
`;
export const CardMeta = system<CardMetaProps>(AntCard.Meta as any);
