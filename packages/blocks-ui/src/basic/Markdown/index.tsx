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

export const getProcessor = () => {
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
            return (
              <Flex
                width="100%"
                // @ts-ignore
                position="relative"
                overflow="hidden"
                pt="56.25%"
                align="center"
                justify="center"
              >
                <iframe
                  style={{ position: 'absolute', top: 0, left: 0 }}
                  height="100%"
                  width="100%"
                  src={props.src}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </Flex>
            );
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

  return processor;
};

export interface MarkdownProps {
  children: string;
}

export const Markdown = ({ children }: MarkdownProps) => {
  const processor = React.useMemo(() => getProcessor(), []);
  const processedMarkdown = React.useMemo(
    () => processor.processSync(children).result as any,
    [processor, children]
  );

  return processedMarkdown;
};
