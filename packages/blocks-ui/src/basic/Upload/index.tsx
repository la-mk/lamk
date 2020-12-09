import { LocalizationContext } from '../Provider';
import { Spinner } from '../Spinner';
import { Image } from '../Image/Image';
import React, { useCallback, useContext } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import { Box } from '../Box';
import { Flex } from '../Flex';
import uniq from 'lodash/uniq';
import { Text } from '../Text';
import { UploadOutlined } from '@ant-design/icons';
import uniqueId from 'lodash/uniqueId';

export interface UploadProps {
  value: string | string[];
  name: string;
  disabled?: boolean;
  multiple?: boolean;
  onChange: (val: string | string[] | null | undefined) => void;
  getImageUrl: (imageId: string) => string;
  remove: (imageId: string) => Promise<void>;
  upload: (file: File) => Promise<{ id: string }>;
}

export type UploadStatus = 'uploading' | 'done' | 'failed';

export interface CustomFile extends File {
  preview: string;
  status: UploadStatus;
  id: string;
}

const Previewer = ({
  file,
  onRemove,
}: {
  file: CustomFile;
  onRemove: (id: string) => void;
}) => {
  return (
    <Box>
      <Spinner isLoaded={file.status !== 'uploading'}>
        <Box m={2} minHeight="100px" height="100px">
          <Image
            onClick={() => onRemove(file.id!)}
            height={100}
            src={file.preview}
            alt="uploaded image"
          />
        </Box>
      </Spinner>
    </Box>
  );
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

  const normalizedExistingFileIds = React.useMemo(() => {
    if (!value) {
      return [];
    }

    return multiple ? (value as string[]) : [value as string];
  }, [value]);

  const existingFiles = normalizedExistingFileIds.map(
    (fileId: string) =>
      ({
        id: fileId,
        status: 'done',
        preview: getImageUrl(fileId),
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
            ...file,
            preview: URL.createObjectURL(file),
            status: 'uploading' as UploadStatus,
            id: uniqueId(),
          } as CustomFile)
      );

      const enhancedRejectedFiles = fileRejections.map(
        file =>
          ({
            ...file.file,
            preview: URL.createObjectURL(file),
            status: 'failed' as UploadStatus,
            id: uniqueId(),
          } as CustomFile)
      );

      setUnprocessedFiles([...enhancedAcceptedFiles, ...enhancedRejectedFiles]);

      Promise.all(
        enhancedAcceptedFiles.map(async file => {
          try {
            const uploadedFile = await upload(file);
            if (multiple) {
              onChange(uniq([...normalizedExistingFileIds, uploadedFile.id]));
              setUnprocessedFiles(files => {
                const oldFile = files.find(f => f.id === file.id);
                if (oldFile) {
                  // This is done in order to prevent memory leaks
                  URL.revokeObjectURL(file.preview);
                }

                return files.filter(f => f.id !== file.id);
              });
            } else {
              onChange(uploadedFile.id);
              setUnprocessedFiles([]);
            }
          } catch (e) {
            setUnprocessedFiles(files => {
              const idx = files.findIndex(x => x.id === file.id);
              if (!idx) {
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
      );
      // Make sure to revoke the data uris to avoid memory leaks
      // URL.revokeObjectURL(file.preview)
      // Do something with the files
    },
    [upload, normalizedExistingFileIds, onChange]
  );

  const onRemove = useCallback(
    (id: string) => {
      if (normalizedExistingFileIds.includes(id)) {
        remove(id)
          .then(() => {
            if (multiple) {
              onChange(normalizedExistingFileIds.filter(x => x !== id));
            } else {
              onChange(null);
            }
          })
          .catch(() => {
            console.error('Failed to remove file');
          });
      } else {
        setUnprocessedFiles(files => files.filter(x => x.id !== id));
      }
    },
    [remove, normalizedExistingFileIds, multiple, onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/png, image/jpg, image/jpeg',
    disabled,
    maxFiles: 31,
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
        // TODO: Add similar effect on hover
        borderColor={isDragActive ? 'primary.500' : 'gray.300'}
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
            <UploadOutlined />
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
