import { Application, Service, Params } from '@feathersjs/feathers';
import * as Minio from 'minio';
// @ts-ignore
import { parseDataURI } from 'dauria';
import * as mimeTypes from 'mime-types';
import { hooks } from './hooks';
import env from '../../common/env';
import { BadRequest, GeneralError } from '../../common/errors';
import uuid from 'uuid/v4';

interface ArtifactsServiceData {
  uri: string;
}

class ArtifactsService implements Service<ArtifactsServiceData> {
  client: Minio.Client;
  bucket: string;

  constructor(options: { client: Minio.Client; bucket: string }) {
    if (!options || !options.client || !options.bucket) {
      throw new GeneralError(
        'Artifacts service: `options.client` and `options.bucket` must be provided',
      );
    }

    this.client = options.client;
    this.bucket = options.bucket;
  }

  // @ts-ignore
  async create(data: Partial<ArtifactsServiceData & { storeId: string }>) {
    const { uri, storeId } = data;

    const result = parseDataURI(uri);
    const contentType = result.MIME;
    const buffer = result.buffer;

    if (!storeId) {
      throw new BadRequest('Missing store ID');
    }

    if (!buffer || !contentType) {
      throw new BadRequest('The uploaded file is invalid');
    }

    const ext = mimeTypes.extension(contentType);
    const id = `${uuid()}.${ext}`;
    await this.client.putObject(
      this.bucket,
      `${storeId}/${id}`,
      buffer,
      undefined,
      // Make file publicly accessible
      { 'x-amz-acl': 'public-read' },
    );
    return {
      _id: id,
      uri: '',
    };
  }

  // @ts-ignore
  async remove(id: string, params: Params) {
    if (!id) {
      throw new BadRequest('Id for removal not passed');
    }

    const storeId = params.query?.storeId;

    if (!storeId) {
      throw new BadRequest('Store ID not passed');
    }

    await this.client.removeObject(this.bucket, `${storeId}/${id.toString()}`);
    return {
      id: id,
      uri: '',
    };
  }
}

export const artifacts = (app: Application) => {
  const minioClient = new Minio.Client({
    endPoint: env().STORAGE_ENDPOINT,
    useSSL: env().NODE_ENV === 'production',
    accessKey: env().STORAGE_ACCESS_KEY_ID,
    secretKey: env().STORAGE_ACCESS_KEY_SECRET,
  });

  app.use(
    '/artifacts',
    new ArtifactsService({
      client: minioClient,
      bucket: env().STORAGE_BUCKET_NAME,
    }),
  );
  const service = app.service('artifacts');
  service.hooks(hooks);
};
