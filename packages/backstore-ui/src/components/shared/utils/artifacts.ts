import { sdk } from '@la-mk/la-sdk';
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
) => async (file: File): Promise<{ id: string }> => {
  return new Promise((resolve, reject) => {
    new Compressor(file, {
      ...options,
      quality: 0.85,
      success: async compressedFile => {
        const base64 = await toBase64(compressedFile);

        sdk.artifact
          .create({ uri: base64 })
          .then(artifact => resolve({ id: artifact._id }))
          .catch(reject);
      },
      error: e => {
        console.log(e);
        reject(e);
      },
    });
  });
};
