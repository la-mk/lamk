import React from 'react';
import unified from 'unified';
import parse from 'remark-parse';
import breaks from 'remark-breaks';
import rehype from 'remark-rehype';
import react from 'rehype-react';
import { Divider } from '../Divider';
import { Text } from '../Text';
import { Heading } from '../Heading';
import { Button } from '../Button';
import { Image } from '../Image/Image';
import { Flex } from '../Flex';
import { Video } from './Video';

const headerMap = [
  { as: 'h1', size: '3xl' },
  { as: 'h2', size: '2xl' },
  { as: 'h3', size: 'xl' },
  { as: 'h4', size: 'lg' },
  { as: 'h5', size: 'md' },
  { as: 'h6', size: 'sm' },
];

let getProcessor = (
  titleLevelOffset: MarkdownViewerProps['titleLevelOffset'] = 0
) =>
  unified()
    .use(parse)
    .use(breaks)
    .use(rehype)
    .use(react, {
      createElement: React.createElement,
      components: {
        br: () => (
          <Text as="span" display="block">
            &#65279;
          </Text>
        ),
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
        h1: (props: any) => (
          <Heading {...headerMap[0 + titleLevelOffset]} mb={5} {...props} />
        ),
        h2: (props: any) => (
          <Heading
            {...headerMap[1 + titleLevelOffset]}
            mb={5}
            mt={6}
            {...props}
          />
        ),
        h3: (props: any) => (
          <Heading
            {...headerMap[2 + titleLevelOffset]}
            mb={4}
            mt={5}
            {...props}
          />
        ),
        h4: (props: any) => (
          <Heading
            {...headerMap[3 + titleLevelOffset]}
            mb={4}
            mt={5}
            {...props}
          />
        ),
        hr: (props: any) => <Divider my={6} {...props} />,
      },
    });

export interface MarkdownViewerProps {
  children: string;
  titleLevelOffset?: 0 | 1 | 2;
}

export const MarkdownViewer = ({
  children,
  titleLevelOffset = 0,
}: MarkdownViewerProps) => {
  const processor = React.useMemo(() => {
    return getProcessor(titleLevelOffset);
  }, [titleLevelOffset]);

  const processedMarkdown = React.useMemo(
    () => processor.processSync(children).result as any,
    [processor, children]
  );

  return processedMarkdown;
};
