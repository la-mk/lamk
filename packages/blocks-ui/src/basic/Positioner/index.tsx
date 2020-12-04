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
    <Box display="inline-block" position="relative" {...props}>
      {children}
      <Box display="inline-block" position="absolute" right={-2} top={-2}>
        {overlayContent}
      </Box>
    </Box>
  );
};
