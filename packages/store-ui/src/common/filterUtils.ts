export const getFiltersFromSetQuery = (query: { [key: string]: any }) => {
  if (query.$sort) {
    const [field, order] = Object.entries(query.$sort)[0];
    return { s: { field, order: order === 1 ? 'ascend' : 'descend' } };
  }

  return { f: query };
};
