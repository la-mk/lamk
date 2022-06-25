import React from 'react';
import { ImageBackgroundBox } from '../shared/components/ImageBackgroundBox';
import { sdk } from '@la-mk/la-sdk';
import { useTheme } from '@chakra-ui/react';
import { Button, Flex, Heading } from '@la-mk/blocks-ui';
import { Store } from '@la-mk/la-sdk/dist/models/store';
import { useTranslation } from '../../common/i18n';
import Link from 'next/link';
import { Media } from '@la-mk/la-sdk/dist/internal-utils';
import { TFunction } from 'next-i18next';
import { DecoratedHeading } from '../shared/components/DecoratedHeading';

const MinimalThemeContent = ({
  slogan,
  t,
}: {
  slogan: string;
  t: TFunction;
}) => {
  return (
    <>
      <Heading mb={6} px={[2, 4, 5]} align='center' as='h1' size={'3xl'}>
        {slogan}
      </Heading>
      <Link href='/products' passHref>
        <Button as='a' size='lg'>
          {t('actions.shopNow')}
        </Button>
      </Link>
    </>
  );
};

const BoldThemeContent = ({
  slogan,
  storeName,
  t,
}: {
  slogan: string;
  storeName: string;
  t: TFunction;
}) => {
  return (
    <Flex
      // @ts-ignore
      borderColor='background.light'
      borderWidth='2px'
      height='100%'
      width='100%'
      align='center'
      justify='center'
      direction='column'
    >
      <DecoratedHeading
        px={[2, 4, 5]}
        align='center'
        as='span'
        size={'xl'}
        color='heading.light'
      >
        {storeName}
      </DecoratedHeading>
      <Heading mb={6} align='center' as='h1' size={'2xl'} color='heading.light'>
        {slogan}
      </Heading>

      <Link href='/products' passHref>
        <Button as='a' size='lg'>
          {t('actions.shopNow')}
        </Button>
      </Link>
    </Flex>
  );
};

export const Banner = ({
  banner,
  hideSlogan,
  store,
}: {
  banner?: Media;
  hideSlogan?: boolean;
  store: Store;
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const ownTheme = theme.sections.Home.banner;
  // variants bold and minimal

  if (!banner) {
    return null;
  }

  const dimensions = {
    style: {
      position: 'absolute',
    },
    top: ['10%', '20%', '20%'],
    bottom: ['10%', '20%', '20%'],
    width: ['90%', '70%', '60%'],
    ml: ['5%', '15%', '20%'],
    p: 3,
  };

  return (
    <Flex bg='white'>
      <ImageBackgroundBox
        mx='auto'
        url={sdk.artifact.getUrlForImage(banner?._id, store._id, { h: 600 })}
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
              {...dimensions}
              // @ts-ignore
              style={{
                ...dimensions.style,
                opacity: ownTheme.variant === 'minimal' ? 0.85 : 1,
              }}
              bg={
                ownTheme.variant === 'minimal'
                  ? 'background.light'
                  : 'background.dark'
              }
            />

            <Flex
              // @ts-ignore
              {...dimensions}
              align='center'
              justify='center'
              direction='column'
            >
              {ownTheme.variant === 'minimal' && (
                <MinimalThemeContent slogan={store.slogan} t={t} />
              )}

              {ownTheme.variant === 'bold' && (
                <BoldThemeContent
                  storeName={store.name}
                  slogan={store.slogan}
                  t={t}
                />
              )}
            </Flex>
          </>
        )}
      </ImageBackgroundBox>
    </Flex>
  );
};
