import styled from 'styled-components';
import { Tabs } from '@sradevski/blocks-ui';

export const BorderlessTabs = styled(Tabs)`
  & .ant-tabs-bar {
    border: none;
  }
`;
