import { LocalizationContext } from '../Provider';
import { Spinner } from '../Spinner';
import { Image as BlocksImage } from '../Image/Image';
import React, { useCallback, useContext } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import { Box } from '../Box';
import { Flex } from '../Flex';
import uniqBy from 'lodash/uniqBy';
import { Text } from '../Text';
import { Trash2, UploadCloud } from 'react-feather';
import uniqueId from 'lodash/uniqueId';
import { Button } from '../Button';
import isEmpty from 'lodash/isEmpty';

export interface Media {
  _id: string;
  height: number;
  width: number;
  size: number;
  mimeType: 'image/jpeg' | 'image/png';
}

export interface UploadProps {
  value: Media | Media[];
  name: string;
  disabled?: boolean;
  multiple?: boolean;
  onChange: (val: Media | Media[] | null | undefined) => void;
  getImageUrl: (imageId: string) => string;
  remove: (imageId: string) => Promise<void>;
  upload: (file: File) => Promise<{ id: string }>;
}

export type UploadStatus = 'uploading' | 'done' | 'failed';

export interface CustomFile {
  file: File;
  preview: string;
  status: UploadStatus;
  id: string;
  mimeType?: 'image/jpeg' | 'image/png';
  mediaInfo?: Media;
}

const Previewer = ({
  file,
  onRemove,
}: {
  file: CustomFile;
  onRemove: (id: string) => void;
}) => {
  const [isRemoveVisible, setIsRemoveVisible] = React.useState(false);
  return (
    <Box>
      <Spinner isLoaded={file.status !== 'uploading'}>
        {/* @ts-ignore */}
        <Box m={2} position="relative">
          <Flex
            // @ts-ignore
            position="absolute"
            left={0}
            top={0}
            right={0}
            bottom={0}
            align="center"
            justify="center"
            onMouseEnter={() => setIsRemoveVisible(true)}
            onMouseLeave={() => setIsRemoveVisible(false)}
            onClick={() => setIsRemoveVisible(x => !x)}
          >
            <Box
              display={isRemoveVisible ? undefined : 'none'}
              // @ts-ignore
              position="absolute"
              left={0}
              top={0}
              right={0}
              bottom={0}
              bg="gray.200"
              opacity={0.5}
            />
            <Button
              // @ts-ignore
              display={isRemoveVisible ? undefined : 'none'}
              onClick={() => onRemove(file.id!)}
              size="xs"
              leftIcon={<Trash2 />}
            />
          </Flex>
          <Box
            minHeight="100px"
            height="100px" // @ts-ignore
          >
            <BlocksImage height={100} src={file.preview} alt="uploaded image" />
          </Box>
        </Box>
      </Spinner>
    </Box>
  );
};

const getMediaFromFile = (
  id: string,
  src: string,
  mimeType: CustomFile['mimeType'],
  size: number
) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        _id: id,
        height: img.height,
        width: img.width,
        size,
        mimeType: mimeType,
      } as Media);
    };

    img.onerror = () => {
      reject();
    };
    img.src = src;
  });
};

export const Upload = ({
  value,
  // name,
  disabled,
  multiple,
  onChange,
  getImageUrl,
  upload,
  remove,
}: UploadProps) => {
  const localization = useContext(LocalizationContext);

  const [unprocesssedFiles, setUnprocessedFiles] = React.useState<
    Array<CustomFile>
  >([]);

  const normalizedUploadedMedia = React.useMemo(() => {
    if (isEmpty(value)) {
      return [];
    }

    return multiple ? (value as Media[]) : [value as Media];
  }, [value]);

  const existingFiles = normalizedUploadedMedia.map(
    file =>
      ({
        id: file._id,
        status: 'done',
        preview: getImageUrl(file._id),
        mimeType: file.mimeType,
        mediaInfo: file,
      } as CustomFile)
  );

  React.useEffect(() => {
    return () => {
      unprocesssedFiles.forEach(file => {
        URL.revokeObjectURL(file.preview);
      });
    };
  }, [unprocesssedFiles]);

  const onDrop = useCallback(
    async (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      const enhancedAcceptedFiles = acceptedFiles.map(
        file =>
          ({
            file,
            preview: URL.createObjectURL(file),
            status: 'uploading' as UploadStatus,
            id: uniqueId(),
            mimeType: file.type ?? 'image/jpeg',
          } as CustomFile)
      );

      const enhancedRejectedFiles = fileRejections.map(
        file =>
          ({
            file: file.file,
            preview: URL.createObjectURL(file),
            status: 'failed' as UploadStatus,
            id: uniqueId(),
          } as CustomFile)
      );

      setUnprocessedFiles([...enhancedAcceptedFiles, ...enhancedRejectedFiles]);

      const uploadedFiles = (
        await Promise.all(
          enhancedAcceptedFiles.map(async file => {
            try {
              const uploadedFileId = (await upload(file.file)).id;
              setUnprocessedFiles(files => {
                return files.filter(f => f.id !== file.id);
              });

              const mediaFile = await getMediaFromFile(
                uploadedFileId,
                getImageUrl(uploadedFileId),
                file.mimeType,
                file.file.size
              );
              // This is done in order to prevent memory leaks
              URL.revokeObjectURL(file.preview);
              return mediaFile;
            } catch (e) {
              setUnprocessedFiles(files => {
                const idx = files.findIndex(x => x.id === file.id);
                if (idx < 0) {
                  return files;
                }

                return [
                  ...files.slice(0, idx),
                  { ...files[idx], status: 'failed' },
                  ...files.slice(idx + 1),
                ];
              });
            }

            return;
          })
        )
      ).filter(x => !!x) as Media[];

      if (multiple) {
        onChange(
          uniqBy([...normalizedUploadedMedia, ...uploadedFiles], x => x._id)
        );
      } else {
        onChange(uploadedFiles[0] ?? null);
      }
    },
    [upload, normalizedUploadedMedia, onChange]
  );

  const onRemove = useCallback(
    (id: string) => {
      if (normalizedUploadedMedia.some(x => x._id === id)) {
        remove(id)
          .then(() => {
            if (multiple) {
              onChange(normalizedUploadedMedia.filter(x => x._id !== id));
            } else {
              onChange(null);
            }
          })
          .catch(() => {
            console.error('Failed to remove file');
          });
      } else {
        setUnprocessedFiles(files => {
          const oldFile = files.find(f => f.id === id);
          if (oldFile) {
            URL.revokeObjectURL(oldFile.preview);
          }
          return files.filter(x => x.id !== id);
        });
      }
    },
    [remove, normalizedUploadedMedia, multiple, onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/png, image/jpeg',
    disabled,
    maxFiles: 20,
    // 15MB
    maxSize: 15000000,
    multiple,
  });

  return (
    <section>
      <Box
        minWidth={'160px'}
        height={'160px'}
        // @ts-ignore
        borderWidth="1px"
        borderStyle="dashed"
        borderColor={isDragActive ? 'primary.500' : 'gray.300'}
        _hover={{
          borderColor: 'primary.500',
        }}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <Flex
          height="100%"
          width="100%"
          align="center"
          justify="center"
          direction="column"
        >
          <Text size="2xl">
            <UploadCloud />
          </Text>
          <Text size="lg">{localization.upload || 'Upload'}</Text>
          <Text size="sm" color="mutedText.dark">
            {localization.uploadHint || 'Support for single or bulk upload'}
          </Text>
        </Flex>
      </Box>
      <Flex wrap="wrap">
        {[...existingFiles, ...unprocesssedFiles].map(f => (
          <Previewer key={f.id} file={f} onRemove={onRemove} />
        ))}
      </Flex>
    </section>
  );
};
