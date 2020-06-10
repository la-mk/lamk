import * as React from 'react';
import InboxOutlined from '@ant-design/icons/InboxOutlined';

export const UploadContent = ({
  text,
  hint,
}: {
  text: string;
  hint: string;
}) => {
  return (
    <>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">{text}</p>
      <p className="ant-upload-hint">{hint}</p>
    </>
  );
};
