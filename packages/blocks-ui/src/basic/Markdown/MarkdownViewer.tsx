import React from 'react';
import { unified } from 'unified';
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
import { List } from '../List';

const headerMap = [
  { as: 'h1', size: '2xl' },
  { as: 'h2', size: 'xl' },
  { as: 'h3', size: 'lg' },
  { as: 'h4', size: 'md' },
  { as: 'h5', size: 'sm' },
  { as: 'h6', size: 'xs' },
];

const getListItems = (children: any) => {
  return (children ?? [])
    .filter((child: any) => typeof child === 'object')
    .map((child: any) => child.props.children[0])
    .filter((child: any) => !!child)
    .map((content: string) => ({ content }));
};

let getProcessor = (
  titleLevelOffset: MarkdownViewerProps['titleLevelOffset'] = 0
) =>
  unified()
    .use(parse)
    .use(rehype)
    .use(react, {
      createElement: React.createElement,
      components: {
        p: (props: any) => <Text as="p" mb={4} {...props} />,
        b: (props: any) => <Text as="b" {...props} />,
        i: (props: any) => <Text as="i" {...props} />,
        blockquote: (props: any) => <Text as="blockquote" mb={3} {...props} />,
        code: (props: any) => <Text as="code" {...props} />,
        a: (props: any) => <Button as="a" variant="link" {...props} />,
        img: (props: any) => {
          // TODO: Find a better way to detect if it is a video from markdown
          const isVideo = props.src.includes('youtube.com');
          if (isVideo) {
            return <Video src={props.src} />;
          }
          return (
            <Flex align="center" justify="center" my={5}>
              <Image {...props} />
            </Flex>
          );
        },
        h1: (props: any) => (
          <Heading
            {...headerMap[0 + titleLevelOffset]}
            mb={5}
            mt={7}
            {...props}
          />
        ),
        h2: (props: any) => (
          <Heading
            {...headerMap[1 + titleLevelOffset]}
            mb={5}
            mt={7}
            {...props}
          />
        ),
        h3: (props: any) => (
          <Heading
            {...headerMap[2 + titleLevelOffset]}
            mb={4}
            mt={6}
            {...props}
          />
        ),
        h4: (props: any) => (
          <Heading
            {...headerMap[3 + titleLevelOffset]}
            mb={4}
            mt={6}
            {...props}
          />
        ),
        hr: (props: any) => <Divider my={6} {...props} />,
        ul: (props: any) => {
          return (
            <List
              mb={4}
              variant="unordered"
              items={getListItems(props.children)}
            />
          );
        },
        ol: (props: any) => {
          return (
            <List
              mb={4}
              variant="ordered"
              items={getListItems(props.children)}
            />
          );
        },
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
