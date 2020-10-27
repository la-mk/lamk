import isString from 'lodash/isString';
import isEmpty from 'lodash/isEmpty';
import uniq from 'lodash/uniq';
import { sdk } from '@sradevski/la-sdk';
import { UploadChangeParam } from 'antd/lib/upload';
import { UploadFile } from 'antd/lib/upload/interface';
import Compressor from 'compressorjs';

export const toBase64 = (file: Blob) => {
  return new Promise<string>((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      resolve(fileReader.result as string);
    };

    fileReader.onerror = err => {
      reject(err);
    };
  });
};

export const getImageUploader = (
  options: {
    maxWidth: number;
    maxHeight: number;
  } = { maxWidth: 1600, maxHeight: 1600 },
) => async ({ file, onSuccess, onError }: any) => {
  new Compressor(file, {
    ...options,
    quality: 0.85,
    success: async compressedFile => {
      const base64 = await toBase64(compressedFile);

      sdk.artifact.create({ uri: base64 }).then(onSuccess).catch(onError);
    },
    error: onError,
  });
};

export const getDefaultFileList = (
  value: string | string[],
  bucket: string,
  params?: any,
) => {
  if (!value || isEmpty(value)) {
    return;
  }

  if (isString(value)) {
    return value
      ? ([
          {
            uid: value,
            name: value,
            status: 'done',
            url: sdk.artifact.getUrlForImage(value, bucket, params),
          },
        ] as UploadFile[])
      : undefined;
  } else {
    return value.map(
      fileId =>
        ({
          uid: fileId,
          name: fileId,
          status: 'done',
          url: sdk.artifact.getUrlForImage(fileId, bucket, params),
        } as UploadFile),
    );
  }
};

export const handleArtifactUploadStatus = (
  info: UploadChangeParam,
  value: string | string[],
  single: boolean,
  onComplete: (val: any) => void,
  onError: (message: string) => void,
) => {
  switch (info.file.status) {
    case 'removed': {
      sdk.artifact
        .remove(info.file.uid)
        .catch(() => {
          console.error('Failed to remove file');
        })
        .then(() => {
          if (single) {
            onComplete(null);
          } else {
            onComplete(
              (value as string[]).filter(
                artifactId => artifactId !== info.file.uid,
              ),
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
        onComplete(uniq([...(value || []), info.file.response._id]));
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
