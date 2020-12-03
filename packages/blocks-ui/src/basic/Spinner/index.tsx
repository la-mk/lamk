import React from 'react';
import {
  Spinner as ChakraSpinner,
  SpinnerProps as ChakraSpinnerProps,
  SpaceProps,
} from '@chakra-ui/react';
import { Flex } from '../Flex';
import styled from 'styled-components';
import { Size } from '../../system';

export interface SpinnerProps
  extends Pick<ChakraSpinnerProps, 'label'>,
    SpaceProps {
  size?: Size;
  isLoaded?: boolean;
  children?: React.ReactNode;
}

ChakraSpinner.defaultProps = {
  color: 'primary.500',
  emptyColor: 'gray.200',
};

const Container = styled.div`
  position: relative;
  width: 100%;
`;

const SpinnerContainer = styled(Flex)`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 4;
`;

const ChildrenContainer = styled.div<{ isLoaded?: boolean }>`
  opacity: ${props => (props.isLoaded ? 1 : 0.4)};
  transition: opacity 250ms;
  z-index: 3;
`;

// TODO: PR this to Chakra
export const Spinner = ({ children, isLoaded, ...props }: SpinnerProps) => {
  if (!children) {
    if (isLoaded) {
      return null;
    }

    return <ChakraSpinner {...props} />;
  }

  return (
    <Container>
      {!isLoaded && (
        <SpinnerContainer justify="center" align="center">
          <ChakraSpinner {...props} mt={0} />
        </SpinnerContainer>
      )}

      <ChildrenContainer isLoaded={isLoaded}>{children}</ChildrenContainer>
    </Container>
  );
};
