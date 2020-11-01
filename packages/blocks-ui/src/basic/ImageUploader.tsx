import uniq from 'lodash/uniq';
import isEmpty from 'lodash/isEmpty';
import { UploadChangeParam } from 'antd/lib/upload';
import React, { useContext } from 'react';
import { UploadDragger } from './Upload';
import { UploadContent } from '../compound/UploadContent';
import { UploadFile } from 'antd/lib/upload/interface';
import { LocalizationContext } from './Provider';

export interface ImageUploaderProps {
  value: string | string[];
  onChange: (val: string | string[]) => void;
  name: string;
  getImageUrl: (imageId: string) => string;
  remove: (imageId: string) => Promise<void>;
  upload: ({ file, onSuccess, onError }: any) => Promise<void>;
  multiple?: boolean;
}

const handleArtifactUploadStatus = (
  info: UploadChangeParam,
  value: string | string[],
  remove: (val: string) => Promise<void>,
  onComplete: (val: any) => void,
  onError: (message: string) => void
) => {
  const single = Array.isArray(value) ? false : true;

  switch (info.file.status) {
    case 'removed': {
      remove(info.file.uid)
        .catch(() => {
          console.error('Failed to remove file');
        })
        .then(() => {
          if (single) {
            onComplete(null);
          } else {
            onComplete(
              (value as string[]).filter(
                artifactId => artifactId !== info.file.uid
              )
            );
          }
        });

      break;
    }

    // There will be a response only if the image upload succeeded
    case 'done': {
      if (single) {
        onComplete(info.file.response._id);
      } else {
        onComplete(
          uniq([...((value as string[]) ?? []), info.file.response._id])
        );
      }
      break;
    }

    // TODO: Localize error
    case 'error': {
      onError(`${info.file.name} file upload failed.`);
      break;
    }
  }
};

export const getDefaultFileList = (
  value: string | string[],
  getImageUrl: (imageId: string) => string
) => {
  if (!value || isEmpty(value)) {
    return;
  }

  if (Array.isArray(value)) {
    return value.map(
      fileId =>
        ({
          uid: fileId,
          name: fileId,
          status: 'done',
          url: getImageUrl(fileId),
        } as UploadFile)
    );
  } else {
    return value
      ? ([
          {
            uid: value,
            name: value,
            status: 'done',
            url: getImageUrl(value),
          },
        ] as UploadFile[])
      : undefined;
  }
};

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

  return (
    <UploadDragger
      multiple={multiple}
      accept=".png, .jpg, .jpeg"
      listType={multiple ? 'picture-card' : 'picture'}
      name={name}
      defaultFileList={getDefaultFileList(value, getImageUrl)}
      customRequest={upload}
      onChange={(info: UploadChangeParam) =>
        handleArtifactUploadStatus(info, value, remove, onChange, console.log)
      }
    >
      <UploadContent
        text={localization.upload || 'Upload'}
        hint={localization.uploadHint || 'Support for single or bulk upload'}
      />
    </UploadDragger>
  );
};
