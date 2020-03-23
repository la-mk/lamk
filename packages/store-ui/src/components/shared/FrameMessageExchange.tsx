import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

const FixedSizeIFrame = styled.iframe`
  border: 0;
  padding: 0;
  margin: 0;
  height: 600px;
  width: 800px;
`;

interface FrameMessageExchangeProps {
  frameName: string;
  onLoad: () => void;
  onResponse: (response: { error?: any; data?: any }) => void;
}

export const FrameMessageExchange = ({
  frameName,
  onLoad,
  onResponse,
}: FrameMessageExchangeProps) => {
  const frameRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!frameRef?.current) {
      return;
    }

    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'handshake_start') {
        frameRef.current.contentWindow.postMessage(
          { type: 'handshake_end' },
          '*',
        );
      } else if (event.data.type === 'data') {
        onResponse(event.data.data);
      }
    };

    window.addEventListener('message', handleMessage, false);
    return () => window.removeEventListener('message', handleMessage, false);
  }, [frameRef, onResponse]);

  return <FixedSizeIFrame ref={frameRef} name={frameName} onLoad={onLoad} />;
};
