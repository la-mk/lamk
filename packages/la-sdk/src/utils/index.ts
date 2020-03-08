export {validate, validateSingle} from './validation'
export { getShortId } from './general'
export * as pricing from './pricing'

export type OmitServerProperties<T> = Omit<
  T,
  '_id' | 'modifiedAt' | 'createdAt'
>;
