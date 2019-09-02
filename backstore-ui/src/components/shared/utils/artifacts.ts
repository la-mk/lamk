import isString from 'lodash/isString';
import isEmpty from 'lodash/isEmpty';
import { sdk } from 'la-sdk';
import { UploadChangeParam } from 'antd/lib/upload';
import { UploadFile } from 'antd/lib/upload/interface';

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

export const uploadImage = async ({ file, onSuccess, onError }: any) => {
  const base64 = await toBase64(file);

  sdk.artifact
    .create({ uri: base64 })
    .then(onSuccess)
    .catch(onError);
};

export const getDefaultFileList = (value?: string | string[]) => {
  if (isString(value)) {
    return value
      ? ([
          {
            uid: value,
            name: value,
            status: 'done',
            url: sdk.artifact.getUrlForArtifact(value),
          },
        ] as UploadFile[])
      : undefined;
  } else {
    return !isEmpty(value)
      ? value!.map(
          fileId =>
            ({
              uid: fileId,
              name: fileId,
              status: 'done',
              url: sdk.artifact.getUrlForArtifact(fileId),
            } as UploadFile),
        )
      : undefined;
  }
};

export const handleArtifactUploadStatus = (
  info: UploadChangeParam,
  value: string | string[],
  onComplete: (val: any) => void,
  onError: (message: string) => void,
) => {
  switch (info.file.status) {
    // There will be a response only if the image upload succeeded
    case 'removed': {
      if (isString(value) && value) {
        sdk.artifact.remove(value);
        onComplete(null);
      } else if (!isEmpty(value) && info.file.response) {
        sdk.artifact.remove(info.file.response.id);
        onComplete(
          (value as string[]).filter(
            artifactId => artifactId !== info.file.response.id,
          ),
        );
      }

      break;
    }

    case 'done': {
      if (isString(value)) {
        onComplete(info.file.response.id);
      } else {
        onComplete([...value, info.file.response.id]);
      }
      break;
    }

    case 'error': {
      onError(`${info.file.name} file upload failed.`);
      break;
    }
  }
};
