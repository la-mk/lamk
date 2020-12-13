import { Box } from '@chakra-ui/react';
import React from 'react';

export interface PositionerProps {
  children: React.ReactNode;
  overlayContent: React.ReactNode;
}

export const Positioner = ({
  children,
  overlayContent,
  ...props
}: PositionerProps) => {
  return (
    <Box width="100%" display="inline-block" position="relative" {...props}>
      {children}
      <Box
        lineHeight="1"
        display="inline"
        position="absolute"
        right={-2}
        top={-2}
      >
        {overlayContent}
      </Box>
    </Box>
  );
};
