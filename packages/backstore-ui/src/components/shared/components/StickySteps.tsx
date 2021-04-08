import { Steps } from 'antd';
import styled from '@emotion/styled';

export const StickySteps = styled(Steps)`
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: white;
  width: 100%;
  margin-bottom: ${props => props.theme.space[4]}px !important;
`;
