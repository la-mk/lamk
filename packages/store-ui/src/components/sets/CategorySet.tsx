import React from 'react';
import { Flex, Box, Label } from '@sradevski/blocks-ui';
import { Category } from '@sradevski/la-sdk/dist/models/category';
import { useTranslation } from '../../common/i18n';
import { SetTitle } from './SetTitle';
import { sdk } from '@sradevski/la-sdk';
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

      <Flex alignItems='center' justifyContent='center' flexWrap='wrap'>
        {categoriesToShow.map(categoryName => {
          return (
            <Box key={categoryName} my={4} mx={[2, 3, 4]}>
              <HoverableLink
                href={getLevel2CategoryHref(categoryName, categories)}
              >
                <ImageBackgroundBox
                  height={280}
                  minWidth={320}
                  maxWidth={420}
                  borderRadius={0}
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
                    alignItems='center'
                    justifyContent='center'
                    bg='background.dark'
                    borderRadius={0}
                    style={{
                      position: 'absolute',
                      bottom: 16,
                      left: 16,
                      right: 16,
                    }}
                  >
                    <Label
                      size='xsmall'
                      color='contentInversePrimary'
                      $style={{ letterSpacing: '2px' }}
                    >
                      {t(`categories.${categoryName}`).toUpperCase()}
                    </Label>
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
