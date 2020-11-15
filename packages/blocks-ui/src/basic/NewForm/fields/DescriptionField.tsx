import React from 'react';
import { FieldProps } from '@rjsf/core';
import { Paragraph } from '../../Typography';

const DescriptionField = ({ description }: FieldProps) => {
  if (!description) {
    return null;
  }

  return (
    <Paragraph mb={1} color="mutedText.dark">
      {description}
    </Paragraph>
  );
};

export default DescriptionField;
