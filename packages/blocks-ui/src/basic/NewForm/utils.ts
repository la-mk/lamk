export const isSchemaOfType = (schema: any, type: string) => {
  if (Array.isArray(schema.type)) {
    return schema.type.includes(type);
  } else {
    return schema.type === type;
  }
};
