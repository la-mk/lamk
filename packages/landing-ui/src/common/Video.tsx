import React, { useEffect } from 'react';
import { Flex } from '@sradevski/blocks-ui';
import { track } from './analytics';
import { AnalyticsEvents } from '@sradevski/analytics';

interface VideoProps {
  mp4?: string;
  webm?: string;
  height: string | string[];
}

export const Video = ({ mp4, webm, height }: VideoProps) => {
  useEffect(() => {
    track(AnalyticsEvents.openVideo, { source: webm ?? mp4 });
  }, []);

  return (
    <>
      {(mp4 || webm) && (
        <Flex
          // @ts-ignore
          style={{ objectFit: 'contain' }}
          align='center'
          justify='center'
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
