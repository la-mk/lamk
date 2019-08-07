import * as React from 'react';
import { Icon } from '../basic/Icon';

export const UploadContent = ({
  text,
  hint,
}: {
  text: string;
  hint: string;
}) => {
  return (
    <>
      <p className='ant-upload-drag-icon'>
        <Icon type='inbox' />
      </p>
      <p className='ant-upload-text'>{text}</p>
      <p className='ant-upload-hint'>{hint}</p>
    </>
  );
};
