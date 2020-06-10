import React from 'react';
import { Input, TextArea } from '../basic/Input';
import { InputProps, TextAreaProps } from 'antd/es/input';

export const formInput = (props: InputProps = {}) => (
  val: any,
  onChange: (val: any) => void,
  onComplete: (val: any) => void
) => <Input {...props} value={val} onChange={onChange} onBlur={onComplete} />;

export const formTextArea = (props: TextAreaProps = {}) => (
  val: any,
  onChange: (val: any) => void,
  onComplete: (val: any) => void
) => (
  <TextArea
    {...props}
    style={{ resize: 'none' }}
    value={val}
    onBlur={onComplete}
    onChange={onChange}
  />
);

export const parsers = {
  number: (val: string) => {
    const parsed = parseFloat(val);
    return Number.isNaN(parsed) || !Number.isFinite(parsed) ? null : parsed;
  },
  integer: (val: string) => {
    const parsed = parseInt(val, 10);
    return Number.isNaN(parsed) || !Number.isFinite(parsed) ? null : parsed;
  },
};
