import styled from 'styled-components';

export const SizedImage = styled.img<{ height?: string; width?: string }>`
  object-fit: contain;
  max-width: ${props => props.width || '100%'};
  max-height: ${props => props.height || '100%'};
  width: auto;
  height: auto;
`;
