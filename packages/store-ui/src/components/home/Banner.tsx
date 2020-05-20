import React from 'react';
import { ImageBackgroundBox } from '../shared/ImageBackgroundBox';
import { sdk } from '@sradevski/la-sdk';
import { Button, Flex, Title } from '@sradevski/blocks-ui';

export const Banner = ({
  banner,
  storeId,
}: {
  banner?: string;
  storeId: string;
}) => {
  if (!banner) {
    return null;
  }

  return (
    <ImageBackgroundBox
      url={sdk.artifact.getUrlForArtifact(banner, storeId)}
      height={[450, 600, 600]}
      style={{ position: 'relative' }}
    >
      <Flex
        style={{
          position: 'absolute',
          top: '20%',
          bottom: '20%',
          left: '30%',
          right: '30%',
          opacity: 0.85,
        }}
        borderRadius={0}
        bg='background.light'
        alignItems='center'
        justifyContent='center'
        flexDirection='column'
      >
        <Title level={1}>This is the slogan</Title>
        <Button size='large' type='primary'>
          Shop now
        </Button>
      </Flex>
    </ImageBackgroundBox>
  );
};
