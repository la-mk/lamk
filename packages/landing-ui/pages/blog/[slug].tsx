import React from 'react';
import { Post } from '../../src/blog/Post';
import { Post as PostType } from '../../src/blog/Posts';
import { Head } from '../../src/common/Head';

const PostPage = ({ post }: { post: PostType }) => {
  return (
    <>
      <Head
        previewImages={['https://la.mk/logo-padding.png']}
        siteName='la.mk'
        title={post.title}
        description={post.summary}
      />
      <Post post={post} />
    </>
  );
};

export default PostPage;

// This function ge ts called at build time
export async function getStaticProps({ params }) {
  const fs = require('fs');
  const fm = require('front-matter');
  const slug = params.slug;
  const path = `${process.cwd()}/contents/${slug}.md`;
  const rawContent = await fs.promises.readFile(path, {
    encoding: 'utf-8',
  });
  const { attributes, body } = fm(rawContent);

  return {
    props: {
      post: { ...attributes, body },
    },
  };
}

// generate HTML paths at build time
export async function getStaticPaths({ params }) {
  const fs = require('fs');

  const contents = await fs.promises.readdir(
    `${process.cwd()}/contents`,
    'utf-8',
  );

  const fileNames = contents
    .filter(fn => fn.endsWith('.md'))
    .map(fn => fn.replace('.md', ''));

  return {
    paths: fileNames.map(fileName => {
      return {
        params: {
          slug: fileName,
        },
      };
    }),
    fallback: false,
  };
}
