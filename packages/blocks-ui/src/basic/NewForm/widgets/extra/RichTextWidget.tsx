import React from 'react';
import { WidgetProps } from '@rjsf/core';
import { MarkdownEditor } from '../../../Markdown/MarkdownEditor';

const RichTextWidget = ({
  autofocus,
  disabled,
  id,
  onBlur,
  onChange,
  onFocus,
  options,
  placeholder,
  readonly,
  value,
}: WidgetProps) => {
  const [richTextState, setRichTextState] = React.useState<any>([]);
  const { height } = options;

  const handleBlur = (results: string) => {
    onBlur(id, results);
    onChange(results);
  };
  const handleFocus = () => onFocus(id, '');

  return (
    <MarkdownEditor
      height={height as string}
      id={id}
      placeholder={placeholder}
      stringifiedValue={value ?? ''}
      value={richTextState}
      onChange={setRichTextState}
      onBlur={handleBlur}
      onFocus={handleFocus}
      autoFocus={autofocus}
      disabled={disabled}
      readOnly={readonly}
    />
  );
};

export default RichTextWidget;
