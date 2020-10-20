import React, { useContext } from 'react';
import { WidgetProps } from '@rjsf/core';
import { ImageUploader } from '../../ImageUploader';
import { FormContext, FormContextProps } from '../Context';

const ImageUploadWidget = ({ onChange, value, options }: WidgetProps) => {
  const { name } = options;
  const { imageUpload } = useContext<FormContextProps>(FormContext);

  if (!imageUpload) {
    return null;
  }

  return (
    <ImageUploader
      onChange={onChange}
      value={value}
      name={(name as string) ?? 'uploader'}
      getImageUrl={imageUpload.getImageUrl}
      remove={imageUpload.removeImage}
      upload={imageUpload.uploadImage}
    />
  );
};

export default ImageUploadWidget;
