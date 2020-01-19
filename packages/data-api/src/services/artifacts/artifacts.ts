import * as crypto from 'crypto';
import { Application, Service, Params } from '@feathersjs/feathers';
import * as Minio from 'minio';
// @ts-ignore
import { parseDataURI } from 'dauria';
import * as mimeTypes from 'mime-types';
import { hooks } from './hooks';
import env from '../../common/env';
import { BadRequest } from '../../common/errors';

const BUCKETS_REGION = 'fra-1';

const getReadPolicy = (bucketName: string) =>
  JSON.stringify({
    Version: '2012-10-17',
    Statement: [
      {
        Action: ['s3:GetObject'],
        Effect: 'Allow',
        Principal: {
          AWS: ['*'],
        },
        Resource: [`arn:aws:s3:::${bucketName}/*`],
        Sid: '',
      },
    ],
  });

const bufferToHash = (buffer: Buffer) => {
  const hash = crypto.createHash('sha256');
  hash.update(buffer);
  return hash.digest('hex');
};

interface ArtifactsServiceData {
  uri: string;
}

class ArtifactsService implements Service<ArtifactsServiceData> {
  client: Minio.Client;
  constructor(options: { client: Minio.Client }) {
    if (!options || !options.client) {
      throw new Error(
        'Artifacts service: constructor `options.client` must be provided',
      );
    }

    this.client = options.client;
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

    const bucket = storeId;
    const bucketExists = await this.client.bucketExists(bucket);
    if (!bucketExists) {
      await this.client.makeBucket(bucket, BUCKETS_REGION);
      await this.client.setBucketPolicy(bucket, getReadPolicy(bucket));
    }

    const ext = mimeTypes.extension(contentType);
    const id = `${bufferToHash(buffer)}.${ext}`;
    await this.client.putObject(bucket, id, buffer);
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

    await this.client.removeObject(storeId, id.toString());
    return {
      id: id,
      uri: '',
    };
  }
}

export const artifacts = (app: Application) => {
  const minioClient = new Minio.Client({
    endPoint: env.STORAGE_ENDPOINT,
    port: 80,
    useSSL: false,
    accessKey: env.STORAGE_ACCESS_KEY_ID,
    secretKey: env.STORAGE_ACCESS_KEY_SECRET,
  });

  app.use('/artifacts', new ArtifactsService({ client: minioClient }));
  const service = app.service('artifacts');
  service.hooks(hooks);
};
