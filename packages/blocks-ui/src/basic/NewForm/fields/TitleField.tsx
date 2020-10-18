import React from 'react';
import { FieldProps } from '@rjsf/core';
import { Text } from '../../Typography';

const TitleField = ({ title, required }: FieldProps) => {
  if (!title) {
    return null;
  }

  return (
    <Text mb={1} fontSize={1}>
      {title}
      {required ? <Text color="danger">*</Text> : null}
    </Text>
  );
};

export default TitleField;
