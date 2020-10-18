import React from 'react';
import { FieldProps } from '@rjsf/core';
import { Text } from '../../Typography';

const TitleField = ({ title }: FieldProps) => {
  if (!title) {
    return null;
  }

  return (
    <Text mb={2} fontSize={1}>
      {title}
    </Text>
  );
};

export default TitleField;
