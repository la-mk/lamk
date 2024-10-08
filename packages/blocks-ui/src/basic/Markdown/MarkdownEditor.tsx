import React, { useMemo, useCallback, useEffect } from 'react';
import { createEditor, Node } from 'slate';
import { withHistory } from 'slate-history';
import { Slate, withReact } from 'slate-react';
import {
  ListPlugin,
  HeadingPlugin,
  ParagraphPlugin,
  BlockquotePlugin,
  BoldPlugin,
  EditablePlugins,
  ItalicPlugin,
  // UnderlinePlugin,
  // LinkPlugin,
  // ImagePlugin,
  // MediaEmbedPlugin,
  HeadingToolbar,
  BalloonToolbar,
  ToolbarElement,
  ToolbarList,
  ToolbarMark,
  // ToolbarLink,
  // ToolbarImage,
  // withInlineVoid,
  // withLink,
  withList,
  withMarks,
  pipe,
  setDefaults,
  DEFAULTS_BLOCKQUOTE,
  DEFAULTS_BOLD,
  DEFAULTS_HEADING,
  DEFAULTS_ITALIC,
  DEFAULTS_LIST,
  DEFAULTS_PARAGRAPH,
  // DEFAULTS_LINK,
  // DEFAULTS_MEDIA_EMBED,
  // DEFAULTS_UNDERLINE,
  // DEFAULTS_IMAGE,
  // MARK_UNDERLINE,
  MARK_BOLD,
  MARK_ITALIC,
} from '@udecode/slate-plugins';
import {
  Bold,
  Italic,
  Triangle,
  // LinkOutlined,
  // FileImageOutlined,
  // UnderlineOutlined,
  List,
  Menu,
} from 'react-feather';
import { Divider } from '../Divider';
import { Box } from '../Box';
import { unified } from 'unified';
import markdown from 'remark-parse';
import remarkToSlate, { serialize } from 'remark-slate';
import { ErrorBoundary } from '../ErrorBoundary';
// import gfm from 'remark-gfm';
// import stringify from 'remark-stringify';
// import { slateToRemark, remarkToSlate } from 'remark-slate-transformer';

const fromProcessor = unified().use(markdown).use(remarkToSlate);

// Below transformer is a bit nicer, but we need https://github.com/inokawa/remark-slate-transformer/issues/31 closed
// https://github.com/inokawa/remark-slate-transformer
// const toProcessor = unified()
//   .use(slateToRemark)
//   .use(gfm)
//   .use(stringify);

// const toMarkdown = (value: Node[]) => {
//   const ast = toProcessor.runSync({
//     type: 'root',
//     children: value,
//   });
//   return toProcessor.stringify(ast);
// };

const toMarkdown = (value: Node[]) => {
  return value.map((v: any) => serialize(v) ?? '').join('');
};

const fromMarkdown = (value?: string) => {
  if (!value) {
    return [];
  }

  return fromProcessor.processSync(value).result as Node[];
};

const options = {
  ...setDefaults(DEFAULTS_PARAGRAPH, {}),
  ...setDefaults(DEFAULTS_BLOCKQUOTE, {}),
  ...setDefaults(DEFAULTS_LIST, {}),
  ...setDefaults(DEFAULTS_HEADING, {}),
  ...setDefaults(DEFAULTS_BOLD, {}),
  ...setDefaults(DEFAULTS_ITALIC, {}),
  // ...setDefaults(DEFAULTS_LINK, {}),
  // ...setDefaults(DEFAULTS_UNDERLINE, {}),
  // ...setDefaults(DEFAULTS_IMAGE, {}),
  // ...setDefaults(DEFAULTS_MEDIA_EMBED, {}),
};

const plugins = [
  ListPlugin(),
  BlockquotePlugin(),
  ParagraphPlugin(),
  BoldPlugin(),
  ItalicPlugin(),
  HeadingPlugin(),
  // LinkPlugin(),
  // ImagePlugin(),
  // MediaEmbedPlugin(),
];

const withPlugins = [
  withReact,
  withHistory,
  withList(),
  withMarks(),
  // withLink(),
  // withInlineVoid({ plugins }),
] as const;

const TitleIcon = ({ level }: { level: number }) => {
  return (
    <svg height="30" width="30">
      <text fill="currentColor" x="0" y="16">
        H{level}
      </text>
    </svg>
  );
};

export interface MarkdownEditorProps {
  value: Node[];
  stringifiedValue?: string;
  onChange: (val: Node[]) => void;
  onBlur?: (markdownResult: string) => void;
  onFocus?: any;
  placeholder?: string;
  autoFocus?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  id?: string;
  height?: string;
}

export const MarkdownEditor = ({
  id,
  value,
  stringifiedValue,
  onChange,
  onBlur,
  onFocus,
  placeholder,
  autoFocus,
  disabled,
  readOnly,
  height,
}: MarkdownEditorProps) => {
  const editor = useMemo(
    () => withReact(pipe(createEditor(), ...withPlugins)),
    []
  );

  useEffect(() => {
    const markdownArray = fromMarkdown(stringifiedValue);
    while (value?.length > markdownArray.length) {
      markdownArray.push({ type: 'p', children: [{ text: '' }] });
    }
    onChange(
      markdownArray.length === 0
        ? [{ type: 'p', children: [{ text: '' }] }]
        : markdownArray
    );

    // TODO: Not including initialValue prevents a crash: // https://github.com/udecode/slate-plugins/issues/285 since the parsed will have different array structure than the existing one (less elements, etc.)
  }, [stringifiedValue]);

  const handleBlur = useCallback(() => {
    onBlur?.(toMarkdown(value));
  }, [onBlur, value]);

  const handleFocus = useCallback(() => {
    onFocus?.(toMarkdown(value));
  }, [onFocus, value]);

  return (
    <ErrorBoundary>
      <Box
        // @ts-ignore
        style={{
          border: `1px solid rgb(238, 238, 238)`,
          borderRadius: '8px',
        }}
      >
        <Slate editor={editor} value={value} onChange={onChange}>
          <HeadingToolbar
            styles={{
              root: {
                flexWrap: 'wrap',
                padding: '4px 8px',
                margin: 0,
                borderBottom: `1px solid rgb(238, 238, 238)`,
              },
            }}
          >
            <ToolbarElement
              type={options.h1.type}
              icon={<TitleIcon level={1} />}
            />
            <ToolbarElement
              type={options.h2.type}
              icon={<TitleIcon level={2} />}
            />
            <ToolbarElement
              type={options.h3.type}
              icon={<TitleIcon level={3} />}
            />
            <ToolbarElement
              type={options.h4.type}
              icon={<TitleIcon level={4} />}
            />

            <Box mx={2} height={30}>
              <Divider orientation="vertical" />
            </Box>
            <ToolbarList
              {...options}
              typeList={options.ul.type}
              icon={<List />}
            />
            <ToolbarList
              {...options}
              typeList={options.ol.type}
              icon={<Menu />}
            />
            <ToolbarElement
              type={options.blockquote.type}
              icon={<Triangle />}
            />

            <Box mx={2} height={30}>
              <Divider orientation="vertical" />
            </Box>

            <ToolbarMark type={MARK_BOLD} icon={<Bold />} />
            <ToolbarMark type={MARK_ITALIC} icon={<Italic />} />
            {/* <ToolbarMark type={MARK_UNDERLINE} icon={<UnderlineOutlined />} /> */}
            {/* 
          <Box mx={2} height={30}>
            <Divider orientation="vertical" />
          </Box> */}

            {/* <ToolbarLink {...options} icon={<LinkOutlined />} /> */}
            {/* <ToolbarImage {...options} icon={<FileImageOutlined />} /> */}
          </HeadingToolbar>
          <BalloonToolbar arrow>
            <ToolbarMark
              reversed
              type={MARK_BOLD}
              icon={<Bold />}
              tooltip={{ content: 'Bold (⌘B)' }}
            />
            <ToolbarMark
              reversed
              type={MARK_ITALIC}
              icon={<Italic />}
              tooltip={{ content: 'Italic (⌘I)' }}
            />
            {/* <ToolbarMark
          reversed
          type={MARK_UNDERLINE}
          icon={<UnderlineOutlined />}
          tooltip={{ content: 'Underline (⌘U)' }}
        /> */}
          </BalloonToolbar>
          <EditablePlugins
            style={{ padding: '8px', height, overflow: 'auto' }}
            id={id}
            autoFocus={autoFocus}
            plugins={plugins}
            placeholder={placeholder ?? ''}
            onBlur={handleBlur}
            onFocus={handleFocus}
            disabled={disabled}
            readOnly={readOnly}
          />
        </Slate>
      </Box>
    </ErrorBoundary>
  );
};
