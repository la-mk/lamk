import React from 'react';
import { ImageBackgroundBox } from '../shared/components/ImageBackgroundBox';
import { sdk } from '@sradevski/la-sdk';
import { Button, Display, Flex, Heading } from '@sradevski/blocks-ui';
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
              <Display
                as='h1'
                px={[2, 3, 4]}
                textAlign='center'
                size={['small', 'medium', 'medium']}
              >
                {store.slogan}
              </Display>

              <Button>
                <Link href='/products'>{t('actions.shopNow')}</Link>
              </Button>
            </Flex>
          </>
        )}
      </ImageBackgroundBox>
    </Flex>
  );
};
