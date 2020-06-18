import React from 'react';
import { ImageBackgroundBox } from '../shared/components/ImageBackgroundBox';
import { sdk } from '@sradevski/la-sdk';
import { Button, Flex, Title } from '@sradevski/blocks-ui';
import { Store } from '@sradevski/la-sdk/dist/models/store';
import { useTranslation } from '../../common/i18n';
import Link from 'next/link';

export const Banner = ({
  banner,
  store,
}: {
  banner?: string;
  store: Store;
}) => {
  const { t } = useTranslation();
  if (!banner) {
    return null;
  }

  return (
    <ImageBackgroundBox
      url={sdk.artifact.getUrlForArtifact(banner, store._id)}
      height={[450, 600, 600]}
      style={{ position: 'relative' }}
    >
      {store.slogan && (
        <Flex
          style={{
            position: 'absolute',
            top: '20%',
            bottom: '20%',
            opacity: 0.85,
          }}
          width={['80%', '70%', '60%']}
          ml={['10%', '15%', '20%']}
          borderRadius={0}
          bg='background.light'
          alignItems='center'
          justifyContent='center'
          flexDirection='column'
        >
          <Title
            px={[2, 3, 4]}
            textAlign='center'
            level={1}
            fontSize={[5, 6, 6]}
          >
            {store.slogan}
          </Title>
          <Link href='/products' passHref>
            <Button size='large' type='primary'>
              {t('actions.shopNow')}
            </Button>
          </Link>
        </Flex>
      )}
    </ImageBackgroundBox>
  );
};
