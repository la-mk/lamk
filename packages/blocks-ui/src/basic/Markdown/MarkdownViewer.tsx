import React from 'react';
import unified from 'unified';
import parse from 'remark-parse';
import rehype from 'remark-rehype';
import react from 'rehype-react';
import { Divider } from '../Divider';
import { Text } from '../Text';
import { Heading } from '../Heading';
import { Button } from '../Button';
import { Image } from '../Image/Image';
import { Flex } from '../Flex';
import { Video } from './Video';

let processor = unified()
  .use(parse)
  .use(rehype)
  .use(react, {
    createElement: React.createElement,
    components: {
      p: (props: any) => <Text as="p" {...props} />,
      b: (props: any) => <Text as="b" {...props} />,
      i: (props: any) => <Text as="i" {...props} />,
      blockquote: (props: any) => <Text as="blockquote" {...props} />,
      code: (props: any) => <Text as="code" {...props} />,
      a: (props: any) => <Button as="a" variant="link" {...props} />,
      img: (props: any) => {
        // TODO: Find a better way to detect if it is a video from markdown
        const isVideo = props.src.includes('youtube.com');
        if (isVideo) {
          return <Video src={props.src} />;
        }
        return (
          <Flex align="center" justify="center" my={3}>
            <Image {...props} />
          </Flex>
        );
      },
      h1: (props: any) => <Heading as="h1" size="3xl" mb={5} {...props} />,
      h2: (props: any) => (
        <Heading as="h2" size="2xl" mb={5} mt={6} {...props} />
      ),
      h3: (props: any) => (
        <Heading as="h3" size="xl" mb={4} mt={5} {...props} />
      ),
      h4: (props: any) => (
        <Heading as="h4" size="lg" mb={4} mt={5} {...props} />
      ),
      hr: (props: any) => <Divider my={6} {...props} />,
    },
  });

export interface MarkdownViewerProps {
  children: string;
}

export const MarkdownViewer = ({ children }: MarkdownViewerProps) => {
  const processedMarkdown = React.useMemo(
    () => processor.processSync(children).result as any,
    [processor, children]
  );

  return processedMarkdown;
};
