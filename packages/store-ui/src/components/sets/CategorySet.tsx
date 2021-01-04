import React from 'react';
import { Flex, Box, Text } from '@la-mk/blocks-ui';
import { Category } from '@la-mk/la-sdk/dist/models/category';
import { useTranslation } from '../../common/i18n';
import { SetTitle } from './SetTitle';
import { sdk } from '@la-mk/la-sdk';
import { ImageBackgroundBox } from '../shared/components/ImageBackgroundBox';
import { HoverableLink } from '../shared/components/HoverableLink';
import { getLevel2CategoryHref } from '../../common/filterUtils';

interface CategorySetProps {
  categories: Category[];
  categoriesToShow: string[];
  title: string;
  subtitle: string;
}

export const CategorySet = ({
  categories,
  categoriesToShow,
  title,
  subtitle,
}: CategorySetProps) => {
  const { t } = useTranslation();

  return (
    <>
      <SetTitle emphasized title={title} subtitle={subtitle} />

      <Flex align='center' justify='center' wrap='wrap'>
        {categoriesToShow.map(categoryName => {
          return (
            <Box key={categoryName} my={4} mx={[4, 4, 5]}>
              <HoverableLink
                href={getLevel2CategoryHref(categoryName, categories)}
              >
                <ImageBackgroundBox
                  height={'18rem'}
                  minWidth={'20rem'}
                  maxWidth={'24rem'}
                  // @ts-ignore
                  borderRadius={'md'}
                  style={{
                    position: 'relative',
                  }}
                  url={sdk.artifact.getUrlForImage(
                    `${categoryName}.jpg`,
                    'categories',
                    { h: 280 },
                  )}
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
              </HoverableLink>
            </Box>
          );
        })}
      </Flex>
    </>
  );
};
