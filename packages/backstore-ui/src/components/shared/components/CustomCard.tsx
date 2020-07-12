import styled from 'styled-components';
import { Flex } from '@sradevski/blocks-ui';

export const CustomCard = styled(Flex)`
  border-radius: ${props => props.theme.radii[1]}px;
  overflow: hidden;
  z-index: 1;
`;
