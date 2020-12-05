import React from 'react';
import { FieldProps } from '@rjsf/core';
import { Text } from '../../Text';

const DescriptionField = ({ description }: FieldProps) => {
  if (!description) {
    return null;
  }

  return (
    <Text as="p" mb={1} size="sm" color="mutedText.dark">
      {description}
    </Text>
  );
};

export default DescriptionField;
