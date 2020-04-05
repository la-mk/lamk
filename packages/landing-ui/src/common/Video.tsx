import React from 'react';
import { Flex } from '@sradevski/blocks-ui';

interface VideoProps {
  mp4?: string;
  webm?: string;
  height: string | string[];
}

export const Video = ({ mp4, webm, height }: VideoProps) => {
  return (
    <>
      {(mp4 || webm) && (
        <Flex
          style={{ objectFit: 'contain' }}
          alignItems='center'
          justifyContent='center'
          height={height}
        >
          <video
            preload='true'
            autoPlay
            muted={false}
            loop={false}
            playsInline
            controls
            width='100%'
            height='100%'
            style={{ objectFit: 'contain' }}
          >
            {mp4 && <source src={mp4} type='video/mp4' />}
            {webm && <source src={webm} type='video/webm' />}
          </video>
        </Flex>
      )}
    </>
  );
};
