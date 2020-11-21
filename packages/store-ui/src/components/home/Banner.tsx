import React from 'react';
import { ImageBackgroundBox } from '../shared/components/ImageBackgroundBox';
import { sdk } from '@sradevski/la-sdk';
import { Button, Flex, Title, Box } from '@sradevski/blocks-ui';
import { Store } from '@sradevski/la-sdk/dist/models/store';
import { useTranslation } from '../../common/i18n';
import Link from 'next/link';

export const Banner = ({
  banner,
  hideSlogan,
  store,
}: {
  banner?: string;
  hideSlogan?: boolean;
  store: Store;
}) => {
  const { t } = useTranslation();
  if (!banner) {
    return null;
  }

  return (
    <Flex bg='white'>
      <ImageBackgroundBox
        mx='auto'
        url={sdk.artifact.getUrlForImage(banner, store._id, { h: 600 })}
        height={[450, 600, 600]}
        maxWidth={1520}
        width='100%'
        style={{ position: 'relative' }}
      >
        {store.slogan && !hideSlogan && (
          <>
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
            />
            <Flex
              style={{
                position: 'absolute',
                top: '20%',
                bottom: '20%',
              }}
              width={['80%', '70%', '60%']}
              ml={['10%', '15%', '20%']}
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
                <Button as='a' size='lg'>
                  {t('actions.shopNow')}
                </Button>
              </Link>
            </Flex>
          </>
        )}
      </ImageBackgroundBox>
    </Flex>
  );
};
