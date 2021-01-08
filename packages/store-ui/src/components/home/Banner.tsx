import React from 'react';
import { ImageBackgroundBox } from '../shared/components/ImageBackgroundBox';
import { sdk } from '@la-mk/la-sdk';
import { Button, Flex, Heading, Box } from '@la-mk/blocks-ui';
import { Store } from '@la-mk/la-sdk/dist/models/store';
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
        height={['26rem', '38rem', '38rem']}
        maxWidth={'96rem'}
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
              width={['90%', '70%', '60%']}
              ml={['5%', '15%', '20%']}
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
              width={['90%', '70%', '60%']}
              ml={['5%', '15%', '20%']}
              align='center'
              justify='center'
              direction='column'
            >
              <Heading
                mb={6}
                px={[2, 4, 5]}
                align='center'
                as='h1'
                size={'3xl'}
              >
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
