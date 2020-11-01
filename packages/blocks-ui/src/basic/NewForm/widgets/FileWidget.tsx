import React, { useContext } from 'react';
import { WidgetProps } from '@rjsf/core';
import { ImageUploader } from '../../ImageUploader';
import { FormContext, FormContextProps } from '../Context';

// FUTURE: For now we only upload images, so we use the image uploader here. Generalize when needed.
const FileWidget = ({ onChange, value, options, multiple }: WidgetProps) => {
  const { name } = options;
  const { imageUpload } = useContext<FormContextProps>(FormContext);

  if (!imageUpload) {
    return null;
  }

  return (
    <ImageUploader
      multiple={multiple}
      onChange={onChange}
      value={value}
      name={(name as string) ?? 'uploader'}
      getImageUrl={imageUpload.getImageUrl}
      remove={imageUpload.removeImage}
      upload={imageUpload.uploadImage}
    />
  );
};

export default FileWidget;
