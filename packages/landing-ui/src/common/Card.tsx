import { Box } from '@sradevski/blocks-ui';
import styled from 'styled-components';

export const Card = styled(Box)`
  border-radius: ${(props) => props.theme.radii[1]}px;
  box-shadow: 0px 4px 24px rgba(0, 0, 0, 0.1);
  z-index: 1;
`;
