import React from 'react';
import { Flex, Box, Text, Heading } from '@la-mk/blocks-ui';
import { Category } from '@la-mk/la-sdk/dist/models/category';
import { useTranslation } from '../../common/i18n';
import { SetTitle } from './SetTitle';
import { sdk } from '@la-mk/la-sdk';
import { useTheme } from '@chakra-ui/react';
import sampleSize from 'lodash/sampleSize';
import { ImageBackgroundBox } from '../shared/components/ImageBackgroundBox';
import { HoverableLink } from '../shared/components/HoverableLink';
import { getLevel2CategoryHref } from '../../common/filterUtils';
import { TFunction } from 'next-i18next';

interface CategorySetProps {
  categories: Category[];
  title: string;
  subtitle: string;
}

const IllustratedCategory = ({
  categoryName,
  t,
}: {
  categoryName: string;
  t: TFunction;
}) => {
  return (
    <ImageBackgroundBox
      height={'18rem'}
      minWidth={'18rem'}
      maxWidth={'24rem'}
      // @ts-ignore
      borderRadius={'md'}
      style={{
        position: 'relative',
      }}
      url={sdk.artifact.getUrlForImage(`${categoryName}.jpg`, 'categories', {
        h: 280,
      })}
    >
      <Flex
        p={[2, 2, 3]}
        align='center'
        justify='center'
        bg='background.dark'
        // @ts-ignore
        borderRadius={'md'}
        style={{
          position: 'absolute',
          bottom: 16,
          left: 16,
          right: 16,
        }}
      >
        <Text size='sm' color='text.light' letterSpacing='wider'>
          {t(`categories.${categoryName}`).toUpperCase()}
        </Text>
      </Flex>
    </ImageBackgroundBox>
  );
};

const BoldCategory = ({
  categoryName,
  categoryIndex,
  size,
  t,
}: {
  categoryName: string;
  categoryIndex: number;
  size: 'full' | 'half';
  t: TFunction;
}) => {
  return (
    <ImageBackgroundBox
      height={size === 'full' ? '16rem' : '7rem'}
      width={size === 'full' ? '18rem' : ['9rem', '9rem', '12rem']}
      // @ts-ignore
      borderRadius={'md'}
      style={{
        position: 'relative',
      }}
      url={sdk.artifact.getUrlForImage(
        `bold-background${(categoryIndex % 4) + 1}.jpg`,
        'categories',
        {
          h: 360,
        },
      )}
      p={2}
    >
      <Box
        // @ts-ignore
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          opacity: 0.5,
        }}
        width='100%'
        bg='background.dark'
      />
      <Flex
        // @ts-ignore
        position='relative'
        height='100%'
        p={[2, 2, 3]}
        border='2px solid'
        borderColor='background.light'
        align='center'
        justify='center'
      >
        <Heading
          align='center'
          color='heading.light'
          as='span'
          size={size === 'full' ? 'lg' : 'md'}
        >
          {t(`categories.${categoryName}`).toUpperCase()}
        </Heading>
      </Flex>
    </ImageBackgroundBox>
  );
};

export const CategorySet = ({
  categories,
  title,
  subtitle,
}: CategorySetProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const ownTheme = theme.sections.Categories;

  const categoriesToShow = React.useMemo(() => {
    return sampleSize(
      Array.from(new Set(categories.map(category => category.level2))),
      ownTheme.count,
    );
  }, [categories]);

  return (
    <>
      <SetTitle emphasized title={title} subtitle={subtitle} />

      <Flex align='center' justify='center' wrap='wrap'>
        {categoriesToShow.map((categoryName, idx) => {
          return (
            <Box key={categoryName} my={4} mx={[4, 4, 5]}>
              <HoverableLink
                href={getLevel2CategoryHref(categoryName, categories)}
              >
                {ownTheme.variant === 'illustrated' && (
                  <IllustratedCategory t={t} categoryName={categoryName} />
                )}
                {ownTheme.variant === 'bold' && (
                  <BoldCategory
                    categoryIndex={idx}
                    t={t}
                    size='full'
                    categoryName={categoryName}
                  />
                )}
              </HoverableLink>
            </Box>
          );
        })}
      </Flex>
    </>
  );
};
