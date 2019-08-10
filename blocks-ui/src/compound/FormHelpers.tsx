import React from 'react';
import { Input, TextArea } from '../basic/Input';
import { InputProps, TextAreaProps } from 'antd/es/input';

export const formInput = (props: InputProps = {}) => (
  val: any,
  onChange: (val: any) => void,
  onComplete: (val: any) => void,
) => <Input {...props} value={val} onChange={onChange} onBlur={onComplete} />;

export const formTextArea = (props: TextAreaProps = {}) => (
  val: any,
  onChange: (val: any) => void,
  onComplete: (val: any) => void,
) => (
  <TextArea
    {...props}
    style={{ resize: 'none' }}
    value={val}
    onBlur={onComplete}
    onChange={onChange}
  />
);
