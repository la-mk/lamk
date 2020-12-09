import * as React from 'react';

export interface FormContextProps {
  imageUpload?: {
    getImageUrl: (imageId: string) => string;
    removeImage: (imageId: string) => Promise<void>;
    uploadImage: (file: File) => Promise<{ id: string }>;
  };
}

export const FormContext = React.createContext<FormContextProps>({});
