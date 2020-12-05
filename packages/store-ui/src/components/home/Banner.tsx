import React from 'react';
import { ImageBackgroundBox } from '../shared/components/ImageBackgroundBox';
import { sdk } from '@sradevski/la-sdk';
import { Button, Flex, Heading, Box } from '@sradevski/blocks-ui';
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
        // @ts-ignore
        style={{ position: 'relative' }}
      >
        {store.slogan && !hideSlogan && (
          <>
            <Flex
              // @ts-ignore
              style={{
                position: 'absolute',
                top: '20%',
                bottom: '20%',
                opacity: 0.85,
              }}
              width={['80%', '70%', '60%']}
              ml={['10%', '15%', '20%']}
              //@ts-ignore
              borderRadius={0}
              bg='background.light'
            />
            <Flex
              // @ts-ignore
              style={{
                position: 'absolute',
                top: '20%',
                bottom: '20%',
              }}
              width={['80%', '70%', '60%']}
              ml={['10%', '15%', '20%']}
              align='center'
              justify='center'
              direction='column'
            >
              <Heading px={[2, 3, 4]} align='center' as='h1' size={'xl'}>
                {store.slogan}
              </Heading>
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
