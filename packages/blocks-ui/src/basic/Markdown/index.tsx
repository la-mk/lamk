import React from 'react';
import unified from 'unified';
import parse from 'remark-parse';
import rehype from 'remark-rehype';
import react from 'rehype-react';
import { Divider } from '../Divider';
import { Text } from '../Text';

export const getProcessor = () => {
  let processor = unified()
    .use(parse)
    .use(rehype)
    .use(react, {
      createElement: React.createElement,
      components: {
        p: (props: any) => <Text {...props} />,
        // a: (props: any) => <Link {...props} />,
        // h1: (props: any) => <Heading.h1 {...props} />,
        // h2: (props: any) => <Heading.h2 {...props} />,
        // h3: (props: any) => <Heading.h3 {...props} />,
        // h4: (props: any) => <Heading.h4 {...props} />,
        // h5: (props: any) => <Heading.h5 {...props} />,
        // h6: (props: any) => <Heading.h6 {...props} />,
        hr: (props: any) => <Divider {...props} />,
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
