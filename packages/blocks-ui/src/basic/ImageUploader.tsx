import uniqBy from 'lodash/uniqBy';
import { UploadChangeParam } from 'antd/lib/upload';
import React, { useContext } from 'react';
import { UploadDragger } from './Upload';
import { UploadContent } from '../compound/UploadContent';
import { UploadFile } from 'antd/lib/upload/interface';
import { LocalizationContext } from './Provider';
import { isEqual } from 'lodash';

export interface ImageUploaderProps {
  value: string | string[];
  onChange: (val: string | string[]) => void;
  name: string;
  getImageUrl: (imageId: string) => string;
  remove: (imageId: string) => Promise<void>;
  upload: ({ file, onSuccess, onError }: any) => Promise<void>;
  multiple?: boolean;
}

export const ImageUploader = ({
  value,
  onChange,
  name,
  getImageUrl,
  upload,
  remove,
  multiple,
}: ImageUploaderProps) => {
  const localization = useContext(LocalizationContext);
  const [files, setFiles] = React.useState<UploadFile[]>([]);

  React.useEffect(() => {
    const mappedVal = (
      (multiple ? (value as string[]) : [value as string]) ?? []
    ).map(
      (fileId: string) =>
        ({
          uid: fileId,
          name: fileId,
          status: 'done',
          url: getImageUrl(fileId),
        } as UploadFile)
    );

    const fileIds = files
      .filter(x => x.status === 'done' || x.status === 'success')
      .map(file => file.uid)
      .sort();
    const sortedValues =
      (multiple ? [...(value as string[])] : [value as string]) ?? [].sort();

    if (isEqual(fileIds, sortedValues)) {
      return;
    }

    const newFiles = [...files, ...mappedVal];
    uniqBy(newFiles, x => x.uid);
    onChange(newFiles.map(x => x.uid));
    setFiles(newFiles);
  }, [value, files]);

  const onChangeHanlder = (info: UploadChangeParam) => {
    switch (info.file.status) {
      case 'removed': {
        remove(info.file.uid)
          .catch(() => {
            console.error('Failed to remove file');
          })
          .then(() => {
            setFiles(files.filter(x => x.uid !== info.file.uid));
          });
        break;
      }

      // There will be a response only if the image upload succeeded
      case 'done': {
        const newFiles = [...files, info.file];
        uniqBy(newFiles, x => x.uid);
        setFiles(newFiles);
        break;
      }

      case 'error': {
        const newFiles = [...files, info.file];
        uniqBy(newFiles, x => x.uid);
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
