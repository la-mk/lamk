import React from 'react';
import { Flex, Box, Text } from '@sradevski/blocks-ui';
import { Category } from '@sradevski/la-sdk/dist/models/category';
import { useTranslation } from '../../common/i18n';
import { SetTitle } from './SetTitle';
import { withTheme } from 'styled-components';
import { BlocksTheme } from '@sradevski/blocks-ui/dist/theme';
import Link from 'next/link';
import { sdk } from '@sradevski/la-sdk';
import { ImageBackgroundBox } from '../shared/ImageBackgroundBox';

interface CategorySetProps {
  categories: Category[];
  title: string;
  subtitle: string;
  theme: BlocksTheme;
}

export const CategorySet = withTheme(
  ({ categories, title, subtitle, theme }: CategorySetProps) => {
    const { t } = useTranslation();
    const categoriesToShow = categories.slice(0, 3);

    return (
      <>
        <SetTitle emphasized title={title} subtitle={subtitle} />

        <Flex alignItems='center' justifyContent='center' flexWrap='wrap'>
          {categoriesToShow.map(category => {
            return (
              <Box key={category.level3} my={4} mx={[2, 3, 4]}>
                <Link href='/products'>
                  <a style={{ textDecoration: 'none' }}>
                    <ImageBackgroundBox
                      height={280}
                      minWidth={320}
                      maxWidth={420}
                      borderRadius={0}
                      style={{
                        position: 'relative',
                      }}
                      url={sdk.artifact.getUrlForArtifact(
                        category.level2,
                        'categories',
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
                        <Text
                          fontSize={0}
                          color='text.light'
                          style={{ letterSpacing: '2px' }}
                        >
                          {t(`categories.${category.level2}`).toUpperCase()}
                        </Text>
                      </Flex>
                    </ImageBackgroundBox>
                  </a>
                </Link>
              </Box>
            );
          })}
        </Flex>
      </>
    );
  },
);
