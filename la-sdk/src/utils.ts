export type OmitServerProperties<T> = Omit<
  T,
  '_id' | 'modifiedAt' | 'createdAt'
>;
