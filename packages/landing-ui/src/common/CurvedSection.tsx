import React from 'react';
import { Box } from '@sradevski/blocks-ui';

type CurvedSectionProps = {
  children: React.ReactNode;
  backgroundColor: string;
  direction: 'up' | 'down';
} & React.ComponentProps<typeof Box>;

export const CurvedSection = ({
  children,
  backgroundColor,
  direction,
  ...props
}: CurvedSectionProps) => {
  return (
    <Box {...props}>
      {direction === 'up' && (
        <svg
          style={{ marginBottom: -8, width: '100%' }}
          viewBox='0 0 1199 127'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M666.14 72.5195C523.421 116.932 428.504 -49.3362 248.52 16.4181C181.081 41.0561 167.725 86.9674 0.103405 72.7393C0.056706 95.4439 0.0525365 113.189 0 126.877H1200V45.5771C1200 45.5771 1109.07 139.481 976.195 121.114C843.311 102.747 838.157 18.9873 666.14 72.5195Z'
            fill={backgroundColor}
          />
        </svg>
      )}
      <Box py={5} px={[3, 4, 5]} style={{ backgroundColor }}>
        {children}
      </Box>
      {direction === 'down' && (
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'>
          <path
            fill={backgroundColor}
            fillOpacity='1'
            d='M0,96L80,128C160,160,320,224,480,218.7C640,213,800,139,960,117.3C1120,96,1280,128,1360,144L1440,160L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z'
          ></path>
        </svg>
      )}
    </Box>
  );
};
