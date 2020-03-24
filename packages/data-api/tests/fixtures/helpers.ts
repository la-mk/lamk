import * as _ from 'lodash';
import { Params, Application } from '@feathersjs/feathers';

export type GeneratorFunc<T extends any> = (
  app: Application,
  count: number,
  params?: Params | Params[],
  variableData?: Partial<T> | Partial<T>[],
) => Promise<T[]>;

export const defaultGenerator = <T extends any>(
  {
    modelName,
    defaultFixture,
    uniqueData,
  }: { modelName: string; defaultFixture: any; uniqueData: () => any },
  app: Application,
  count: number,
  params?: Params | Params[],
  variableData?: Partial<T> | Partial<T>[],
): Promise<T[]> => {
  if (
    (variableData &&
      Array.isArray(variableData) &&
      count !== variableData.length) ||
    (params && Array.isArray(params) && count !== params.length)
  ) {
    throw new Error(
      'The params and variable data length have to match with created items count',
    );
  }

  const promises = _.range(0, count).map(index => {
    return app.service(modelName).create(
      {
        ...defaultFixture,
        ...uniqueData(),
        ...(Array.isArray(variableData)
          ? variableData[index]
          : variableData ?? {}),
      },
      Array.isArray(params) ? params[index] : params ?? {},
    );
  });

  return Promise.all(promises);
};
