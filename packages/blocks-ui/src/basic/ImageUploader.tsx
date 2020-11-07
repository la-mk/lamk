import uniqBy from 'lodash/uniqBy';
import { UploadChangeParam } from 'antd/lib/upload';
import React, { useContext } from 'react';
import { UploadDragger } from './Upload';
import { UploadContent } from '../compound/UploadContent';
import { UploadFile } from 'antd/lib/upload/interface';
import { LocalizationContext } from './Provider';

export interface ImageUploaderProps {
  value: string | string[];
  name: string;
  multiple?: boolean;
  onChange: (val: string | string[]) => void;
  getImageUrl: (imageId: string) => string;
  remove: (imageId: string) => Promise<void>;
  upload: ({ file, onSuccess, onError }: any) => Promise<void>;
}

export const ImageUploader = ({
  value,
  name,
  multiple,
  onChange,
  getImageUrl,
  upload,
  remove,
}: ImageUploaderProps) => {
  const localization = useContext(LocalizationContext);
  const [files, setFiles] = React.useState<UploadFile[]>([]);
  const normalizedValue = React.useMemo(
    () => (multiple ? (value as string[]) : [value as string]) ?? [],
    [value]
  );

  React.useEffect(() => {
    const mappedVal = normalizedValue.map(
      (fileId: string) =>
        ({
          uid: fileId,
          name: fileId,
          status: 'done',
          url: getImageUrl(fileId),
        } as UploadFile)
    );

    setFiles(currentFiles => {
      const newFiles = [
        ...mappedVal,
        ...currentFiles.filter(
          file => file.status !== 'success' && file.status !== 'done'
        ),
      ];
      return newFiles;
    });
  }, [normalizedValue]);

  const onChangeHanlder = (info: UploadChangeParam) => {
    switch (info.file.status) {
      case 'removed': {
        remove(info.file.uid)
          .catch(() => {
            console.error('Failed to remove file');
          })
          .then(() => {
            onChange(normalizedValue.filter(x => x !== info.file.uid));
          });
        break;
      }

      // There will be a response only if the image upload succeeded
      case 'done': {
        onChange([
          ...normalizedValue,
          info.file.response._id ?? info.file.response.name,
        ]);
        break;
      }

      // We want to keep the errored files locally so we can show them, but they are not stored in the data.
      case 'error': {
        const newFiles = [...files, info.file];
        uniqBy(newFiles, file => file.uid);
        setFiles(newFiles);
        console.log(
          `${info.file.name} file upload failed. - ${info.file.error}`
        );
        break;
      }
    }
  };

  return (
    <UploadDragger
      multiple={multiple}
      accept=".png, .jpg, .jpeg"
      listType={multiple ? 'picture-card' : 'picture'}
      name={name}
      fileList={files}
      customRequest={upload}
      onChange={onChangeHanlder}
    >
      <UploadContent
        text={localization.upload || 'Upload'}
        hint={localization.uploadHint || 'Support for single or bulk upload'}
      />
    </UploadDragger>
  );
};
