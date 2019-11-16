import * as crypto from 'crypto';
import { Application, Service } from '@feathersjs/feathers';
import * as Minio from 'minio';
// @ts-ignore
import { parseDataURI } from 'dauria';
import * as mimeTypes from 'mime-types';
import { hooks } from './hooks';
import env from '../../common/env';
import { BadRequest } from '../../common/errors';

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
  bucket: string;

  constructor(options: { client: Minio.Client; bucket: string }) {
    if (!options || !options.client) {
      throw new Error(
        'Artifacts service: constructor `options.client` must be provided',
      );
    }

    this.client = options.client;
    this.bucket = options.bucket || 'images';
  }

  // @ts-ignore
  async create(data: Partial<ArtifactsServiceData>) {
    const { uri } = data;

    const result = parseDataURI(uri);
    const contentType = result.MIME;
    const buffer = result.buffer;

    if (!buffer || !contentType) {
      throw new BadRequest('The uploaded file is invalid');
    }

    const ext = mimeTypes.extension(contentType);
    const id = `${bufferToHash(buffer)}.${ext}`;
    await this.client.putObject(this.bucket, id, buffer);
    return {
      _id: id,
      uri: '',
    };
  }

  // @ts-ignore
  async remove(id: string) {
    if (!id) {
      throw new BadRequest('Id for removal not passed');
    }

    await this.client.removeObject(this.bucket, id.toString());
    return {
      id: id,
      uri: '',
    };
  }
}

export const artifacts = (app: Application) => {
  // TODO: This will need some modification for prod.
  const minioClient = new Minio.Client({
    endPoint: env.STORAGE_ENDPOINT,
    port: 80,
    useSSL: false,
    accessKey: env.STORAGE_ACCESS_KEY_ID,
    secretKey: env.STORAGE_ACCESS_KEY_SECRET,
  });

  app.use(
    '/artifacts',
    new ArtifactsService({ client: minioClient, bucket: 'images' }),
  );
  const service = app.service('artifacts');
  service.hooks(hooks);
};
