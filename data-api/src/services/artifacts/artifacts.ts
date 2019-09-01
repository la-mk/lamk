import { Application } from '@feathersjs/feathers';
// @ts-ignore
import * as BlobService from 'feathers-blob';
// @ts-ignore
import * as blobStore from 'safe-fs-blob-store';

import { hooks } from './hooks';

export const artifacts = (app: Application) => {
  const blobStorage = blobStore(__dirname + '/../../../public/images');

  app.use('/artifacts', BlobService({ Model: blobStorage }));
  const service = app.service('artifacts');
  service.hooks(hooks);
};
