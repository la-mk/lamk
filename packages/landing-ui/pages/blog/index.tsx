import React from 'react';
import { Post as PostType, Posts } from '../../src/blog/Posts';
import { Head } from '../../src/common/Head';
import { useTranslation } from '../../src/common/i18n';

function BlogPage({ posts }: { posts: PostType[] }) {
  const { t } = useTranslation();

  return (
    <>
      <Head
        previewImages={['https://la.mk/logo-padding.png']}
        siteName='la.mk'
        title={t('landing.blogPage')}
        description={'landingBlog.heroExplanation'}
      />
      <Posts posts={posts} />
    </>
  );
}

export default BlogPage;

// This function ge ts called at build time
export async function getStaticProps() {
  const fs = require('fs');
  const fm = require('front-matter');

  const contents = await fs.promises.readdir(
    `${process.cwd()}/contents`,
    'utf-8',
  );

  const posts = await Promise.all(
    contents
      .filter(fn => fn.endsWith('.md'))
      .map(async fn => {
        const path = `${process.cwd()}/contents/${fn}`;
        const rawContent = await fs.promises.readFile(path, {
          encoding: 'utf-8',
        });
        const { attributes } = fm(rawContent);

        return attributes;
      }),
  );

  return {
    props: { posts },
  };
}
