import { User } from '@sradevski/la-sdk/dist/models/user';
import Bluebird from 'bluebird';
import { promises as fs } from 'fs';
import * as path from 'path';

export const getExternalUserParams = (user: User) => {
  return {
    provider: 'rest',
    authenticated: true,
    user: user,
  };
};

export const getFixturesContent = async (folderName: string) => {
  const folderPath = path.resolve(process.cwd(), folderName);
  return await fs.readdir(folderPath).then(files =>
    Bluebird.map(files, file => {
      return fs
        .readFile(path.resolve(folderPath, file), 'utf-8')
        .then(JSON.parse);
    }),
  );
};
