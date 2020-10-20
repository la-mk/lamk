import * as React from 'react';

export interface FormContextProps {
  imageUpload?: {
    getImageUrl: (imageId: string) => string;
    removeImage: (imageId: string) => Promise<void>;
    uploadImage: ({ file, onSuccess, onError }: any) => Promise<void>;
  };
}

export const FormContext = React.createContext<FormContextProps>({});
