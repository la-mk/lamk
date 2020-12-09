import React, { useContext } from 'react';
import { WidgetProps } from '@rjsf/core';
import { Upload } from '../../Upload';
import { FormContext, FormContextProps } from '../Context';
import { Box } from '../../Box';

// FUTURE: For now we only upload images, so we use the image uploader here. Generalize when needed.
const FileWidget = ({ onChange, value, options, multiple }: WidgetProps) => {
  const { name } = options;
  const { imageUpload } = useContext<FormContextProps>(FormContext);

  if (!imageUpload) {
    return null;
  }

  return (
    <Box>
      <Upload
        multiple={multiple}
        onChange={onChange}
        value={value}
        name={(name as string) ?? 'uploader'}
        getImageUrl={imageUpload.getImageUrl}
        remove={imageUpload.removeImage}
        upload={imageUpload.uploadImage}
      />
    </Box>
  );
};

export default FileWidget;
