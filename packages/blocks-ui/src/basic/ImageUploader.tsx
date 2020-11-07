import uniq from 'lodash/uniq';
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
  onChange: (val: string | string[] | null | undefined) => void;
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
  const [unprocesssedFiles, setUnprocessedFiles] = React.useState<UploadFile[]>(
    []
  );

  const normalizedExistingFileIds = React.useMemo(() => {
    if (!value) {
      return [];
    }

    return multiple ? (value as string[]) : [value as string];
  }, [value]);

  const existingFiles = normalizedExistingFileIds.map(
    (fileId: string) =>
      ({
        uid: fileId,
        name: fileId,
        status: 'done',
        url: getImageUrl(fileId),
      } as UploadFile)
  );

  React.useEffect(() => {
    const successfulFileIds = unprocesssedFiles
      .filter(file => file.status === 'done' || file.status === 'success')
      .map(file => file.response._id ?? file.uid);

    if (!successfulFileIds.length) {
      return;
    }

    setUnprocessedFiles(files =>
      files.filter(
        file => !successfulFileIds.includes(file.response._id ?? file.uid)
      )
    );

    if (multiple) {
      onChange(uniq([...normalizedExistingFileIds, ...successfulFileIds]));
    } else {
      onChange(successfulFileIds[0] ?? value);
    }
  }, [unprocesssedFiles]);

  const onChangeHanlder = React.useCallback(
    (info: UploadChangeParam) => {
      switch (info.file.status) {
        case 'uploading':
        case 'done':
        case 'success':
        case 'error': {
          setUnprocessedFiles(files => {
            if (multiple) {
              return uniqBy([...files, info.file], file => file.uid);
            }
            return [info.file];
          });
          break;
        }

        case 'removed': {
          remove(info.file.uid)
            .catch(() => {
              console.error('Failed to remove file');
            })
            .then(() => {
              if (normalizedExistingFileIds.includes(info.file.uid)) {
                if (multiple) {
                  onChange(
                    normalizedExistingFileIds.filter(x => x !== info.file.uid)
                  );
                } else {
                  onChange(null);
                }
              } else {
                setUnprocessedFiles(files =>
                  files.filter(x => x.uid !== info.file.uid)
                );
              }
            });
          break;
        }
      }
    },
    [multiple, normalizedExistingFileIds]
  );

  return (
    <UploadDragger
      multiple={multiple}
      accept=".png, .jpg, .jpeg"
      listType={multiple ? 'picture-card' : 'picture'}
      name={name}
      fileList={[...existingFiles, ...unprocesssedFiles]}
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
