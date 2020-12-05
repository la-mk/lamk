import React from 'react';
import { FieldProps } from '@rjsf/core';
import { Text } from '../../Text';

const TitleField = ({ title, required }: FieldProps) => {
  if (!title) {
    return null;
  }

  return (
    <Text mb={1} size={'md'}>
      {title}
      {required ? <Text color="danger">*</Text> : null}
    </Text>
  );
};

export default TitleField;
