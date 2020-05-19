import React from 'react';

export const CurvedDashedLine = (props) => {
  return (
    <svg
      width={'100%'}
      height='130'
      viewBox='0 0 629 130'
      preserveAspectRatio='xMidYMin meet'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <path
        d='M627 1C617.935 50.9984 569.985 145.813 450.71 125.082C301.616 99.1696 237.025 61.2971 157.864 93.1897C94.5358 118.704 26.9012 103.821 1 93.1897'
        stroke='#07074F'
        strokeWidth='3'
        strokeDasharray='8 8'
      />
    </svg>
  );
};
