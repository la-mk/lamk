import React from 'react';
import {
  Box,
  DataGrid,
  Divider,
  Flex,
  hooks,
  Result,
  Text,
} from '@la-mk/blocks-ui';
import Link from 'next/link';
import Router from 'next/router';
import { TitleSection } from './TitleSection';
import { BlocksTheme } from '@la-mk/blocks-ui/dist/theme';
import { Trans } from 'react-i18next';
import { useTranslation } from '../common/i18n';
import { HeroTitle } from '../common/HeroTitle';

export interface Post {
  body: string;
  title: string;
  summary: string;
  slug: string;
  date: string;
}

const PostItem = ({ post }: { post: Post }) => {
  return (
    <Box>
      {/* <Box maxHeight={'90px'} maxWidth={'60px'} minWidth={'60px'}>
        <Image
          height={90}
          getSrc={params =>
            sdk.artifact.getUrlForImage(product.media[0]?._id, storeId, params)
          }
          alt={product.name}
        />
      </Box> */}
      <TitleSection post={post} />
    </Box>
  );
};

export const Posts = ({ posts }: { posts: Post[] }) => {
  const { t } = useTranslation();

  const publishedPosts = posts?.filter(post => {
    const publishDate = new Date(post.date);
    return publishDate.getTime() < Date.now();
  });

  const [filters, setFilters] = hooks.useFilter(
    {
      sorting: {
        field: 'createdAt',
        order: 'descend',
      },
      pagination: {
        currentPage: 1,
        pageSize: 10,
      },
    },
    {
      storage: 'url',
      router: Router,
    },
  );

  return (
    <>
      <HeroTitle description={t('landingBlog.heroExplanation')}>
        <Trans t={t} i18nKey='landingBlog.heroSlogan'>
          Spreading&nbsp;
          <Text
            lineHeight={1.3}
            align='center'
            // @ts-ignore
            fontSize='inherit'
            color='primary.500'
          >
            Knowledge
          </Text>
        </Trans>
      </HeroTitle>

      <Flex
        mb={8}
        mx={'auto'}
        p={3}
        align='center'
        justify='center'
        direction='column'
        maxWidth='48rem'
      >
        {publishedPosts.length === 0 && (
          <Result
            status='empty'
            title={t('store.emptyBlog')}
            description={t('store.emptyBlogExplanation')}
          />
        )}
        {publishedPosts.length > 0 && (
          <DataGrid<Post>
            px={4}
            isFullWidth
            rowKey={'slug'}
            spacing={[6, 6, 7]}
            pagination={{
              currentPage: filters.pagination
                ? filters.pagination.currentPage
                : 1,
              pageSize: filters.pagination ? filters.pagination.pageSize : 10,
              totalItems: publishedPosts.length,
              onChange: (currentPage, pageSize) => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setFilters({
                  ...filters,
                  pagination: { currentPage, pageSize },
                });
              },
            }}
            isLoaded
            items={publishedPosts}
            renderItem={post => (
              <Box>
                <Link href={`/blog/${post.slug}`} passHref>
                  <Box as='a'>
                    <PostItem post={post} />
                  </Box>
                </Link>
                <Divider mt={[6, 6, 7]} />
              </Box>
            )}
          ></DataGrid>
        )}
      </Flex>
    </>
  );
};
