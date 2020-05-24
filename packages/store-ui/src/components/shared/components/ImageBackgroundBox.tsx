import { Box } from '@sradevski/blocks-ui';
import styled from 'styled-components';

export const ImageBackgroundBox = styled(Box)<{ url: string }>`
  position: relative;
  overflow: hidden;
  background: ${props => props.theme.colors.background.light};
  background-image: url(${props => props.url});
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  position: relative;
`;
